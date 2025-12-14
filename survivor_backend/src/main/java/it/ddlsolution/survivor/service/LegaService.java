package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegaService {
    private final LegaRepository legaRepository;
    private final LegaMapper legaMapper;
    private final ICalendario calendario;


    public List<LegaDTO> mieLeghe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        List<LegaDTO> legheDTO = legheUser(userId);

        legheDTO.forEach(l -> addInfoCalcolate(l));
        return legheDTO;
    }

    public List<LegaDTO> legheUser(Long userId) {
        List<Lega> leghe = legaRepository.findByGiocatori_User_Id(userId);
        List<LegaDTO> legheDTO = legaMapper.toDTOList(leghe);
        legheDTO.forEach(l -> addInfoCalcolate(l));
        return legheDTO;
    }

    public LegaDTO getLegaById(Long id) {
        LegaDTO legaDTO = legaRepository.findById(id)
                .map(legaMapper::toDTO)
                .orElse(null);
        legaDTO.setGiocatori(
                legaDTO.getGiocatori().stream().sorted(Comparator.comparing(GiocatoreDTO::getId)).toList()
        );
        addInfoCalcolate(legaDTO);
        return legaDTO;
    }

    public LegaDTO getLegaDTO(Long id) {
        LegaDTO legaDTO = getLegaById(id);
        addInfoCalcolate(legaDTO);
        return legaDTO;
    }

    public LegaDTO salva(LegaDTO legaDTO) {
        return legaMapper.toDTO(legaRepository.save(legaMapper.toEntity(legaDTO)));
    }

    public Enumeratori.StatoPartita statoGiornata(Long idLega, int giornata) {
        LegaDTO legaDTO = getLegaDTO(idLega);
        return statoGiornata(legaDTO, giornata);
    }

    public Enumeratori.StatoPartita statoGiornata(LegaDTO lega, int giornata) {
        List<PartitaDTO> partite = calendario.partite(lega.getCampionato().getSport().getId(), lega.getCampionato().getId(), giornata);
        return statoGiornata(partite);
    }

    private Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite) {
        Map<Enumeratori.StatoPartita, Long> mappa = partite.stream()
                .collect(Collectors.groupingBy(PartitaDTO::getStato, Collectors.counting()));

        int totalePartite = mappa.values().stream().mapToInt(Long::intValue).sum();
        int daGiocare = 0;
        int terminati = 0;

        if (mappa.get(Enumeratori.StatoPartita.DA_GIOCARE) != null && mappa.get(Enumeratori.StatoPartita.DA_GIOCARE) > 0) {
            daGiocare = mappa.get(Enumeratori.StatoPartita.DA_GIOCARE).intValue();
        }
        if (mappa.get(Enumeratori.StatoPartita.TERMINATA) != null && mappa.get(Enumeratori.StatoPartita.TERMINATA) > 0) {
            terminati = mappa.get(Enumeratori.StatoPartita.TERMINATA).intValue();
        }


        if (daGiocare == totalePartite) {
            return Enumeratori.StatoPartita.DA_GIOCARE;
        }
        if (terminati == totalePartite) {
            return Enumeratori.StatoPartita.TERMINATA;
        }
        return Enumeratori.StatoPartita.IN_CORSO;
    }


    public LegaDTO calcola(Long idLega, int giornataDaCalcolare) {
        log.info("CALCOLA");

        LegaDTO legaDTO = getLegaDTO(idLega);
        List<PartitaDTO> partite = calendario.partite(legaDTO.getCampionato().getSport().getId(), legaDTO.getCampionato().getId(), giornataDaCalcolare);
        final int giornataIniziale = legaDTO.getGiornataIniziale();
        Enumeratori.StatoPartita stato = statoGiornata(partite);
        if (stato == Enumeratori.StatoPartita.DA_GIOCARE) {
            throw new RuntimeException("Lo stato della giornata è: " + stato);
        }
        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            if (giocatoreDTO.getStato() != Enumeratori.StatoGiocatore.ELIMINATO) {
                List<GiocataDTO> giocate = giocatoreDTO
                        .getGiocate()
                        .stream().sorted(Comparator.comparing(GiocataDTO::getGiornata))
                        .filter(g -> g.getGiornata() + giornataIniziale - 1 == giornataDaCalcolare)
                        .toList();
                if (giocate.size() != 1) {
                    throw new RuntimeException("Numero di giocate errato: " + giocate.size());
                }
                GiocataDTO giocataDTO = giocate.get(0);
                Boolean vincente = vincente(giocataDTO.getSquadraId(), partite);
                if (vincente != null) {
                    if (vincente) {
                        giocataDTO.setEsito(Enumeratori.EsitoGiocata.OK);
                    } else {
                        giocatoreDTO.setStato(Enumeratori.StatoGiocatore.ELIMINATO);
                        giocataDTO.setEsito(Enumeratori.EsitoGiocata.KO);
                    }
                }

            }
        }
        if (stato == Enumeratori.StatoPartita.TERMINATA) {
            legaDTO.setGiornataCalcolata(giornataDaCalcolare);
        }
        legaDTO = salva(legaDTO);
        addInfoCalcolate(legaDTO);
        return legaDTO;
    }


    private Boolean vincente(String squadraId, List<PartitaDTO> partite) {
        for (PartitaDTO partitaDTO : partite) {
            if (partitaDTO.getStato() != Enumeratori.StatoPartita.TERMINATA) {
                return null;
            }
            String casa = partitaDTO.getCasa();
            String fuori = partitaDTO.getFuori();
            Integer golCasa = partitaDTO.getGolCasa();
            Integer golFuori = partitaDTO.getGolFuori();
            if (casa.equals(squadraId)) {
                if (golCasa > golFuori) {
                    return true;
                } else {
                    return false;
                }
            }
            if (fuori.equals(squadraId)) {
                if (golFuori > golCasa) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        throw new RuntimeException("Squadra non trovata: " + squadraId);
    }

    private void addInfoCalcolate(LegaDTO legaDTO) {
        Integer giornataCalcolata = legaDTO.getGiornataCalcolata();
        int giornataCorrente = (giornataCalcolata == null ? legaDTO.getGiornataIniziale() : giornataCalcolata + 1);
        legaDTO.setGiornataCorrente(giornataCorrente);
        legaDTO.setStatoGiornataCorrente(statoGiornata(legaDTO, giornataCorrente));
    }


}
