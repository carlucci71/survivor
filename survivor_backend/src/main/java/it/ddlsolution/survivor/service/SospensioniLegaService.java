package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.SospensioneLegaDTO;
import it.ddlsolution.survivor.dto.request.SospensioneLegaRequestDTO;
import it.ddlsolution.survivor.dto.response.SospensioniLegaResponseDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.SospensioneLega;
import it.ddlsolution.survivor.mapper.SospensioneLegaMapper;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.SospensioneLegaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static it.ddlsolution.survivor.service.CacheableService.SOSPENSIONI;

@Service
@RequiredArgsConstructor
public class SospensioniLegaService {
    private final SospensioneLegaRepository sospensioneLegaRepository;
    private final SospensioneLegaMapper sospensioneLegaMapper;
    private final CacheableService cacheableService;
    private final LegaRepository legaRepository;

    @Transactional
    public void save(SospensioneLegaRequestDTO sospensioneLegaRequestDTO) {
        if (sospensioneLegaRequestDTO.getVerso()== SospensioneLegaRequestDTO.Verso.ADD) {
            SospensioneLega sospensioneLega = sospensioneLegaMapper.toEntity(sospensioneLegaRequestDTO);
            sospensioneLega.setLega(legaRepository.findById(sospensioneLegaRequestDTO.getIdLega()).orElseThrow(()->new RuntimeException("Lega non trovata: " + sospensioneLegaRequestDTO.getIdLega())));
            sospensioneLegaRepository.save(sospensioneLega);
        } else {
            sospensioneLegaRepository.deleteById_IdLegaAndId_Giornata(sospensioneLegaRequestDTO.getIdLega(),sospensioneLegaRequestDTO.getGiornata());
        }
        cacheableService.invalidateCache(SOSPENSIONI);
    }

    @Transactional(readOnly = true)
    public List<SospensioniLegaResponseDTO> allSospensioni() {
        return cacheableService.allSospensioni();
    }

    @Transactional(readOnly = true)
    public List<SospensioniLegaResponseDTO> allSospensioni(Long idLega) {
        return cacheableService.allSospensioni().stream()
                .filter(s->s.getIdLega().equals(idLega))
                .findFirst()
                .stream()
                .toList();
    }

    @Transactional()
    public void aggiungi(Long idLega, Integer giornata) {
        SospensioneLegaRequestDTO sospensioneLegaRequestDTO = new SospensioneLegaRequestDTO();
        sospensioneLegaRequestDTO.setGiornata(giornata);
        sospensioneLegaRequestDTO.setIdLega(idLega);
        sospensioneLegaRequestDTO.setVerso(SospensioneLegaRequestDTO.Verso.ADD);
        save(sospensioneLegaRequestDTO);


    }
}
