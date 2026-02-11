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

import static it.ddlsolution.survivor.util.Utility.dateFormatLiteWithTime;
import static it.ddlsolution.survivor.util.Utility.toLocalDateTimeItaly;

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
    public void aggiornaMockLocalDateRif(String dateString) {
        Parametri parametri = parametriRepository
                .findByCodice(Enumeratori.CodiciParametri.MOCK_LOCALDATE_RIF)
                .orElseThrow(() -> new RuntimeException("Parametro non trovato: " + Enumeratori.CodiciParametri.MOCK_LOCALDATE_RIF));
        if (dateString.length() != 12) {
            throw new RuntimeException("La data di riferimento deve essere di 12 caratteri");
        }

        try {
            toLocalDateTimeItaly(dateString);
        } catch (Exception e){
            throw new RuntimeException("La data di riferimento deve essere new formato: " + dateFormatLiteWithTime);
        }


        parametri.setValore(dateString);
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

