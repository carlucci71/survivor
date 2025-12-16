package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.LogDispositivaDTO;
import it.ddlsolution.survivor.entity.LogDispositiva;
import it.ddlsolution.survivor.entity.ParamLogDispositiva;
import it.ddlsolution.survivor.mapper.LogDispositivaMapper;
import it.ddlsolution.survivor.repository.LogDispositivaRepository;
import it.ddlsolution.survivor.repository.ParamLogDispositivaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogDispositivaService {
    private final LogDispositivaRepository logDispositivaRepository;
    private final ParamLogDispositivaRepository paramLogDispositivaRepository;
    private final LogDispositivaMapper logDispositivaMapper;

    @Transactional()
    public LogDispositivaDTO salva(LogDispositivaDTO logDispositivaDTO) {
        LogDispositiva logDispositiva = logDispositivaMapper.toEntity(logDispositivaDTO);
        // Assicuro che ogni ParamLogDispositiva referenzi il parent (bidirectional relationship)
        if (logDispositiva.getParamLogDispositive() != null) {
            for (ParamLogDispositiva p : logDispositiva.getParamLogDispositive()) {
                p.setLogDispositiva(logDispositiva);
            }
        }

        // Salvo il parent; la cascade = CascadeType.ALL su LogDispositiva provvederà a salvare i figli
        logDispositiva = logDispositivaRepository.save(logDispositiva);
        return logDispositivaMapper.toDTO(logDispositiva);
    }
}
