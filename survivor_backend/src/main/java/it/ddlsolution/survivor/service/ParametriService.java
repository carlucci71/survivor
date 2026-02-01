package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.ParametriDTO;
import it.ddlsolution.survivor.entity.Parametri;
import it.ddlsolution.survivor.repository.ParametriRepository;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParametriService {
    private final CacheableService cacheableService;
    private final ParametriRepository parametriRepository;

    @Transactional(readOnly = true)
    public List<ParametriDTO> all() {
        return cacheableService.parametri();
    }

    @Transactional
    public void aggiornaMockLocalDateRif(String valore) {
        Parametri parametri = parametriRepository
                .findByCodice(Enumeratori.CodiciParametri.MOCK_LOCALDATE_RIF)
                .orElseThrow(() -> new RuntimeException("Parametro non trovato: " + Enumeratori.CodiciParametri.MOCK_LOCALDATE_RIF));
        parametri.setValore(valore);
        parametriRepository.save(parametri);
        cacheableService.clearCacheParametri();
    }

    @Transactional(readOnly = true)
    public List<ParametriDTO> allByLega(Long idLega) {
        return all()
                .stream()
                .filter(p -> p.getIdLega() != null && p.getIdLega().equals(idLega))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ParametriDTO> allSystem() {
        return all()
                .stream()
                .filter(p -> p.getIdLega() == null)
                .toList();
    }

    @Transactional(readOnly = true)
    public String valueByCode(Enumeratori.CodiciParametri codiciParametri, Long idLega) {
        Optional<ParametriDTO> parametro = allSystem()
                .stream()
                .filter(p -> p.getCodice() == codiciParametri)
                .findFirst();
        if (parametro.isEmpty()) {
            parametro = allByLega(idLega)
                    .stream()
                    .filter(p -> p.getCodice() == codiciParametri)
                    .findFirst();
        }
        if (parametro.isEmpty()) {
            throw new RuntimeException("Il parametro non è valorizzato: " + codiciParametri + " per la lega. " + idLega);
        } else {
            return parametro.get().getValore();
        }
    }

    @Transactional(readOnly = true)
    public String valueByCodeSystem(Enumeratori.CodiciParametri codiciParametri) {
        return allSystem()
                .stream()
                .filter(p -> p.getCodice() == codiciParametri)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Il parametro non è valorizzato: " + codiciParametri))
                .getValore();
    }


}

