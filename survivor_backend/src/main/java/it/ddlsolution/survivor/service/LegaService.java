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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegaService {
    private final LegaRepository legaRepository;
    private final LegaMapper legaMapper;
    private final ICalendario calendario;

    public List<LegaDTO> prova() {
        Iterable<Lega> all = legaRepository.findAll();
        List<Lega> l = StreamSupport.stream(legaRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return legaMapper.toDTOList(l);
    }

    public List<LegaDTO>  mieLeghe(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId;
        // Supponendo che principal sia una classe custom con getId(), altrimenti adattare
        if (principal instanceof it.ddlsolution.survivor.entity.Giocatore) {
            userId = ((it.ddlsolution.survivor.entity.Giocatore) principal).getId();
        } else {
            // Gestione alternativa, ad esempio se principal è uno username
            userId = 1L; // fallback temporaneo
        }
        return legheUser(userId);
    }

    public List<LegaDTO> legheUser(Long userId) {
        List<Lega> byGiocatoriUserId = legaRepository.findByGiocatori_User_Id(userId);
        return legaMapper.toDTOList(byGiocatoriUserId);
    }

    public LegaDTO getLegaById(Long id) {
        LegaDTO legaDTO = legaRepository.findById(id)
                .map(legaMapper::toDTO)
                .orElse(null);
        legaDTO.setGiocatori(
                legaDTO.getGiocatori().stream().sorted(Comparator.comparing(GiocatoreDTO::getId)).toList()
        );
        return legaDTO;
    }

    public LegaDTO getLegaDTO(Long id) {
        return getLegaById(id);
    }

    public LegaDTO salva(LegaDTO legaDTO) {
        return legaMapper.toDTO(legaRepository.save(legaMapper.toEntity(legaDTO)));
    }

    public LegaDTO calcola(Long id, int giornataDaCalcolare){
        log.info("CALCOLA");
        LegaDTO lega = getLegaDTO(id);
        List<PartitaDTO> partite = calendario.partite(lega.getCampionato().getSport().getId(), lega.getCampionato().getId(), giornataDaCalcolare);
        long partiteNonTerminate = partite.stream().filter(p -> p.getStato() != Enumeratori.StatoPartita.TERMINATA).count();
        if (partiteNonTerminate > 0) {
            throw new RuntimeException("Ci sono ancora " + partiteNonTerminate + " non terminate.");
        }
        for (GiocatoreDTO giocatoreDTO : lega.getGiocatori()) {
            if (giocatoreDTO.getStato()!= Enumeratori.StatoGiocatore.ELIMINATO) {
                List<GiocataDTO> giocate = giocatoreDTO
                        .getGiocate()
                        .stream().sorted(Comparator.comparing(GiocataDTO::getGiornata))
                        .filter(g -> g.getGiornata() + lega.getGiornataIniziale() == giornataDaCalcolare)
                        .toList();
                if (giocate.size() != 1){
                    throw new RuntimeException("Numero di giocate errato: " + giocate.size());
                }
                GiocataDTO giocataDTO = giocate.get(0);
                if (vincente(giocataDTO.getSquadraId(),partite)){
                    giocataDTO.setEsito(Enumeratori.EsitoGiocata.OK);
                } else {
                    giocatoreDTO.setStato(Enumeratori.StatoGiocatore.ELIMINATO);
                    giocataDTO.setEsito(Enumeratori.EsitoGiocata.KO);
                }

            }
        }
        return salva(lega);

    }


    private boolean vincente(String squadraId, List<PartitaDTO> partite) {
        for (PartitaDTO partitaDTO : partite) {
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


}
