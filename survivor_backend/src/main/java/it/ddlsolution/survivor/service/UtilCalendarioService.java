package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.dto.response.PartitaDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UtilCalendarioService {

    private final ObjectProvider<ICalendario> calendarioProvider;

    @Transactional(readOnly = true)
    public Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite, int giornata) {
        Map<Enumeratori.StatoPartita, Long> mappa = partite.stream()
                .collect(Collectors.groupingBy(PartitaDTO::getStato, Collectors.counting()));

        int totalePartite = mappa.values().stream().mapToInt(Long::intValue).sum();
        int daGiocare = 0;
        int terminati = 0;
        int inCorso = 0;

        if (mappa.get(Enumeratori.StatoPartita.DA_GIOCARE) != null && mappa.get(Enumeratori.StatoPartita.DA_GIOCARE) > 0) {
            daGiocare = mappa.get(Enumeratori.StatoPartita.DA_GIOCARE).intValue();
        }
        if (mappa.get(Enumeratori.StatoPartita.IN_CORSO) != null && mappa.get(Enumeratori.StatoPartita.IN_CORSO) > 0) {
            inCorso = mappa.get(Enumeratori.StatoPartita.IN_CORSO).intValue();
        }
        if (mappa.get(Enumeratori.StatoPartita.TERMINATA) != null && mappa.get(Enumeratori.StatoPartita.TERMINATA) > 0) {
            terminati = mappa.get(Enumeratori.StatoPartita.TERMINATA).intValue();
        }

        Enumeratori.StatoPartita ret = null;

        if (daGiocare == totalePartite) {
            ret = Enumeratori.StatoPartita.DA_GIOCARE;
        } else if (terminati == totalePartite) {
            ret = Enumeratori.StatoPartita.TERMINATA;
        } else if (terminati > 0 || inCorso > 0) {
            ret = Enumeratori.StatoPartita.IN_CORSO;
        }
        if (ret == null) {
            throw new RuntimeException("Impossibile calcolare lo stato della giornata: " + giornata);
        }
        return ret;
    }

    public List<PartitaDTO> partite(CampionatoDTO campionatoDTO) {
        List<PartitaDTO> ret = new ArrayList<>();
        for (int giornata = 1; giornata <= campionatoDTO.getNumGiornate(); giornata++) {
            ret.addAll(getPartiteAdapted(campionatoDTO, giornata));
        }
        return ret;
    }

    public List<PartitaDTO> partite(CampionatoDTO campionatoDTO, int giornata) {
        return getPartiteAdapted(campionatoDTO, giornata);
    }

    private List<PartitaDTO> getPartiteAdapted(CampionatoDTO campionatoDTO, int giornata) {
        ICalendario calendario = calendarioProvider.getIfAvailable();
        Map<String, String> mapForAdapt = calendario.mapForAdapt().get(campionatoDTO.getId());
        List<PartitaDTO> partite = calendario.getPartite(campionatoDTO.getSport().getId(), campionatoDTO.getId(), giornata);
        if (!ObjectUtils.isEmpty(mapForAdapt)) {
            boolean errore=false;
            for (PartitaDTO partitaDTO : partite) {
                SquadraDTO squadraDTO;
                try {
                    squadraDTO = getSquadraDTO(campionatoDTO, mapForAdapt, partitaDTO.getCasaSigla(), partitaDTO.getCasaNome());
                    partitaDTO.setCasaSigla(squadraDTO.getSigla());
                    partitaDTO.setCasaNome(squadraDTO.getNome());
                } catch (Exception e) {
                    errore=true;
                }
                try {
                    squadraDTO = getSquadraDTO(campionatoDTO, mapForAdapt, partitaDTO.getFuoriSigla(), partitaDTO.getFuoriNome());
                    partitaDTO.setFuoriSigla(squadraDTO.getSigla());
                    partitaDTO.setFuoriNome(squadraDTO.getNome());
                } catch (Exception e) {
                    errore=true;
                }
            }
            if (errore){
                throw new RuntimeException("Squadre da configurare!");
            }
        }

        return partite;
    }

    private static @NonNull SquadraDTO getSquadraDTO(CampionatoDTO campionatoDTO, Map<String, String> mapForAdapt, String squadraSigla, String squadraNome) {
        SquadraDTO squadraDTO;
        List<SquadraDTO> squadreDTO = campionatoDTO.getSquadre();
        String upperCase = squadraNome.replaceAll(" ", "_").replaceAll("-", "").toUpperCase();
        try {
            squadraDTO = squadreDTO.stream().filter(s -> s.getSigla().equals(mapForAdapt.get(squadraSigla))).findFirst()
                    .orElseThrow(() -> new RuntimeException("Squadra da configurare: " +squadraNome)
                    );
        } catch (Exception e) {
            log.info("******-> {} (\"{}\"),", upperCase, squadraSigla);
            log.info("******-> insert into squadra (sigla, nome, id_campionato) values ('{}','{}','{}');",upperCase,squadraNome, campionatoDTO.getId());
            throw new RuntimeException(e);
        }
        return squadraDTO;
    }

    public List<PartitaDTO> calendario(CampionatoDTO campionatoDTO, String squadra, int giornataAttuale, boolean prossimi) {
        List<PartitaDTO> partite = new ArrayList<>();
        if (prossimi) {
            for (int g = giornataAttuale; g < giornataAttuale + 20; g++) {
                if (g <= campionatoDTO.getNumGiornate()) {
                    partite.addAll(addPartiteDellaGiornata(campionatoDTO, squadra, g));
                }
            }
        } else {
            for (int g = giornataAttuale; g >= giornataAttuale - 20; g--) {
                if (g > 0) {
                    partite.addAll(addPartiteDellaGiornata(campionatoDTO, squadra, g).reversed());
                }
            }
        }
        return partite;
    }

    private List<PartitaDTO> addPartiteDellaGiornata(CampionatoDTO campionatoDTO, String squadra, int giornata) {
        return partite(campionatoDTO, giornata)
                .stream()
                .filter(p -> p.getCasaSigla().equals(squadra) || p.getFuoriSigla().equals(squadra))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .toList();
    }


}

