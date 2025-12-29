package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CampionatoService {
    private final CacheableService cacheableService;
    private final StatoGiornataService statoGiornataService;
    private final ICalendario calendario;

    public Optional<CampionatoDTO> findCampionato(String id) {
        return allCampionati()
                .stream()
                .filter(c -> c.getId().equalsIgnoreCase(id))
                .findAny();
    }

    public List<CampionatoDTO> allCampionati() {
        List<CampionatoDTO> campionatiDTO = cacheableService.allCampionati();
        for (CampionatoDTO campionatoDTO : campionatiDTO) {
            Enumeratori.StatoPartita statoPartita;
            int giornata = 0;
            do  {
                giornata++;
                List<PartitaDTO> partite = calendario.partite(campionatoDTO.getSport().getId(), campionatoDTO.getId(), giornata);
                statoPartita = statoGiornataService.statoGiornata(partite, giornata);
            }while ( giornata <= campionatoDTO.getNumGiornate() && statoPartita != Enumeratori.StatoPartita.DA_GIOCARE);
            campionatoDTO.setGiornataDaGiocare(giornata);
        }

        return campionatiDTO;
    }

    public List<CampionatoDTO> campionatiBySport(String idSport) {
        return allCampionati().stream()
                .filter(c -> c.getSport().getId().equals(idSport))
                .toList();
    }
}
