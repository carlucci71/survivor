package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.PronosticoVincitoreDTO;
import it.ddlsolution.survivor.dto.VotoPronosticoDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.PronosticoVincitore;
import it.ddlsolution.survivor.exception.ManagedException;
import it.ddlsolution.survivor.repository.GiocatoreLegaRepository;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.PronosticoVincitoreRepository;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PronosticoVincitoreService {

    private final PronosticoVincitoreRepository pronosticoVincitoreRepository;
    private final GiocatoreLegaRepository giocatoreLegaRepository;
    private final GiocatoreRepository giocatoreRepository;
    private final LegaRepository legaRepository;

    @Transactional
    public PronosticoVincitoreDTO salvaPronostico(Long idLega, Long idGiocatorePronosticato) {
        Long userId = currentUserId();
        Lega lega = legaRepository.findById(idLega)
                .orElseThrow(() -> new ManagedException("Lega non trovata", ManagedException.InternalCode.LEGA_NOT_FOUND));

        if (lega.getStato() == Enumeratori.StatoLega.TERMINATA) {
            throw new ManagedException("La lega è già terminata", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }

        GiocatoreLega mioRuolo = giocatoreLegaRepository.findByLega_IdAndGiocatore_User_Id(idLega, userId)
                .orElseThrow(() -> new ManagedException("Non fai parte di questa lega", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA));
        if (mioRuolo.getStato() != Enumeratori.StatoGiocatore.ELIMINATO) {
            throw new ManagedException("Solo un giocatore eliminato può pronosticare il vincitore", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }

        GiocatoreLega ruoloPronosticato = giocatoreLegaRepository.findByGiocatore_IdAndLega_Id(idGiocatorePronosticato, idLega)
                .orElseThrow(() -> new ManagedException("Giocatore non trovato in questa lega", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA));
        if (ruoloPronosticato.getStato() != Enumeratori.StatoGiocatore.ATTIVO) {
            throw new ManagedException("Puoi pronosticare solo un giocatore ancora attivo", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }

        Giocatore io = mioRuolo.getGiocatore();
        Giocatore pronosticato = ruoloPronosticato.getGiocatore();

        PronosticoVincitore pronostico = pronosticoVincitoreRepository.findByLega_IdAndGiocatore_Id(idLega, io.getId())
                .orElseGet(PronosticoVincitore::new);
        pronostico.setLega(lega);
        pronostico.setGiocatore(io);
        pronostico.setGiocatorePronosticato(pronosticato);
        if (pronostico.getCreatedAt() == null) {
            pronostico.setCreatedAt(LocalDateTime.now());
        }
        pronosticoVincitoreRepository.save(pronostico);

        return new PronosticoVincitoreDTO(pronosticato.getId(), pronosticato.getNickname(), null);
    }

    @Transactional(readOnly = true)
    public PronosticoVincitoreDTO getMioPronostico(Long idLega) {
        Long userId = currentUserId();
        Giocatore io = giocatoreRepository.findByUser_Id(userId)
                .orElseThrow(() -> new ManagedException("Giocatore non trovato", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA));

        Optional<PronosticoVincitore> pronosticoOpt = pronosticoVincitoreRepository.findByLega_IdAndGiocatore_Id(idLega, io.getId());
        if (pronosticoOpt.isEmpty()) {
            return null;
        }

        PronosticoVincitore pronostico = pronosticoOpt.get();
        Boolean indovinato = calcolaIndovinato(pronostico);

        return new PronosticoVincitoreDTO(
                pronostico.getGiocatorePronosticato().getId(),
                pronostico.getGiocatorePronosticato().getNickname(),
                indovinato
        );
    }

    @Transactional(readOnly = true)
    public List<VotoPronosticoDTO> getClassificaPronostici(Long idLega) {
        List<PronosticoVincitore> pronostici = pronosticoVincitoreRepository.findByLega_Id(idLega);

        Map<Long, Long> conteggioPerGiocatoreId = pronostici.stream()
                .collect(Collectors.groupingBy(p -> p.getGiocatorePronosticato().getId(), Collectors.counting()));

        Map<Long, String> nicknamePerGiocatoreId = pronostici.stream()
                .collect(Collectors.toMap(
                        p -> p.getGiocatorePronosticato().getId(),
                        p -> p.getGiocatorePronosticato().getNickname(),
                        (esistente, nuovo) -> esistente
                ));

        return conteggioPerGiocatoreId.entrySet().stream()
                .map(e -> new VotoPronosticoDTO(e.getKey(), nicknamePerGiocatoreId.get(e.getKey()), e.getValue()))
                .sorted(Comparator.comparingLong(VotoPronosticoDTO::getVoti).reversed())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countPronosticiCorretti(Long giocatoreId) {
        return pronosticoVincitoreRepository.findByGiocatore_Id(giocatoreId).stream()
                .filter(p -> Boolean.TRUE.equals(calcolaIndovinato(p)))
                .count();
    }

    private Boolean calcolaIndovinato(PronosticoVincitore pronostico) {
        if (pronostico.getLega().getStato() != Enumeratori.StatoLega.TERMINATA) {
            return null;
        }
        return giocatoreLegaRepository
                .findByGiocatore_IdAndLega_Id(pronostico.getGiocatorePronosticato().getId(), pronostico.getLega().getId())
                .map(gl -> Integer.valueOf(1).equals(gl.getPosizioneFinale()))
                .orElse(false);
    }

    private Long currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Long) authentication.getPrincipal();
    }
}
