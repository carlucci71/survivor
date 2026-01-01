package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.SportDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SportService {
    private final CacheableService cacheableService;

    @Transactional(readOnly = true)
    public List<SportDTO> all() {
        return cacheableService.allSport();
    }
}

