package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.SospensioneLegaDTO;
import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.entity.Sport;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.mapper.SospensioneLegaMapper;
import it.ddlsolution.survivor.mapper.SportMapper;
import it.ddlsolution.survivor.repository.CampionatoRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.SospensioneLegaRepository;
import it.ddlsolution.survivor.repository.SportRepository;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Data
@RequiredArgsConstructor
public class CacheableService {
    private final LegaRepository legaRepository;
    private final CampionatoRepository campionatoRepository;
    private final CampionatoMapper campionatoMapper;
    private final LegaMapper legaMapper;
    private final RestTemplate restTemplate;
    private final SospensioneLegaRepository sospensioneLegaRepository;
    private final SospensioneLegaMapper sospensioneLegaMapper;
    private final SportRepository sportRepository;
    private final SportMapper sportMapper;

    // Lazy provider e servizio di utilità per calcolo stato giornata
    private final ObjectProvider<ICalendario> calendarioProvider;
    private final StatoGiornataService statoGiornataService;

    public final static String CAMPIONATI="campionati";
    public final static String SPORT="sport";
    public final static String SOSPENSIONI="sospensioni";
    public final static String URL="cache-url";

    @Cacheable(value = CAMPIONATI)
    public List<CampionatoDTO> allCampionati() {
        List<CampionatoDTO> campionatiDTO =  campionatoMapper.toDTOList(campionatoRepository.findAll());

        ICalendario calendario = calendarioProvider.getIfAvailable();
        // Se non è disponibile un'implementazione di calendario, semplicemente restituiamo i DTO originali
        if (calendario == null) {
            return campionatiDTO;
        }

        for (CampionatoDTO campionatoDTO : campionatiDTO) {
            Enumeratori.StatoPartita statoPartita;
            int giornata = 0;
            do {
                giornata++;
                List<?> partiteRaw = calendario.partite(campionatoDTO.getSport().getId(), campionatoDTO.getId(), giornata);
                // cast sicuro assumendo che ICalendario restituisca List<PartitaDTO>
                @SuppressWarnings("unchecked")
                List<it.ddlsolution.survivor.dto.PartitaDTO> partite = (List<it.ddlsolution.survivor.dto.PartitaDTO>) partiteRaw;
                statoPartita = statoGiornataService.statoGiornata(partite, giornata);
            } while (giornata < campionatoDTO.getNumGiornate() && statoPartita != Enumeratori.StatoPartita.DA_GIOCARE);
            if (statoPartita == Enumeratori.StatoPartita.TERMINATA) {
                giornata = 1; // mantenuto comportamento precedente
            }
            campionatoDTO.setGiornataDaGiocare(giornata);
        }

        return campionatiDTO;
    }

    @Cacheable(value = SPORT)
    public List<SportDTO> allSport() {
        List<Sport> sport = sportRepository.findAll();
        return sportMapper.toDTOList(sport);
    }

    @Cacheable(cacheNames = URL, key = "#root.args[0]")
    public <T> T cacheUrl(String url, Class<T> clazz) {
        ResponseEntity<T> forEntity = restTemplate.getForEntity(url, clazz);
        T response = forEntity.getBody();
        return response;
    }

    @Cacheable(value = SOSPENSIONI)
    public Map<Long, List<Integer>> allSospensioni() {
        List<SospensioneLegaDTO> sospensioniLegaDTO = sospensioneLegaMapper.toDTOList(sospensioneLegaRepository.findAll());
        return sospensioniLegaDTO.stream()
                .collect(Collectors.groupingBy(
                        SospensioneLegaDTO::getIdLega,
                        Collectors.mapping(SospensioneLegaDTO::getGiornata, Collectors.toList())
                ));
    }
}
