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

    public Enumeratori.StatoPartita stato(Long idLega, int giornata){
        LegaDTO legaDTO = getLegaDTO(idLega);
        return stato(legaDTO,giornata);
    }

    public Enumeratori.StatoPartita stato(LegaDTO lega, int giornata){
        List<PartitaDTO> partite = calendario.partite(lega.getCampionato().getSport().getId(), lega.getCampionato().getId(), giornata);
        return stato(partite);
    }

    private Enumeratori.StatoPartita stato(List<PartitaDTO> partite){
        Map<Enumeratori.StatoPartita, List<PartitaDTO>> mappa = partite.stream()
                .collect(Collectors.groupingBy(PartitaDTO::getStato));
        if (mappa.get(Enumeratori.StatoPartita.DA_GIOCARE) != null && mappa.get(Enumeratori.StatoPartita.DA_GIOCARE).size()>0){
            return Enumeratori.StatoPartita.DA_GIOCARE;
        } else if (mappa.get(Enumeratori.StatoPartita.IN_CORSO) != null && mappa.get(Enumeratori.StatoPartita.IN_CORSO).size()>0){
            return Enumeratori.StatoPartita.IN_CORSO;
        }
        return Enumeratori.StatoPartita.TERMINATA;
    }


    public LegaDTO calcola(Long idLega, int giornataDaCalcolare){
        log.info("CALCOLA");
        LegaDTO legaDTO = getLegaDTO(idLega);
        List<PartitaDTO> partite = calendario.partite(legaDTO.getCampionato().getSport().getId(), legaDTO.getCampionato().getId(), giornataDaCalcolare);
        Enumeratori.StatoPartita stato = stato(partite);
        if (stato != Enumeratori.StatoPartita.TERMINATA){
            throw new RuntimeException("Lo stato della giornata è: " + stato);
        }
        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            if (giocatoreDTO.getStato()!= Enumeratori.StatoGiocatore.ELIMINATO) {
                List<GiocataDTO> giocate = giocatoreDTO
                        .getGiocate()
                        .stream().sorted(Comparator.comparing(GiocataDTO::getGiornata))
                        .filter(g -> g.getGiornata() + legaDTO.getGiornataIniziale() -1 == giornataDaCalcolare)
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
        legaDTO.setGiornataCalcolata(giornataDaCalcolare);
        return salva(legaDTO);

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
