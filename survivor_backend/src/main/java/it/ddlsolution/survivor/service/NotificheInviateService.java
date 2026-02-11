package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.NotificheInviateDTO;
import it.ddlsolution.survivor.entity.NotificheInviate;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.mapper.NotificheInviateMapper;
import it.ddlsolution.survivor.repository.NotificheInviateRepository;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificheInviateService {
    private final NotificheInviateRepository notificheInviateRepository;
    private final NotificheInviateMapper notificheInviateMapper;
    private final CampionatoMapper campionatoMapper;

    @Transactional(readOnly = true)
    public Optional<NotificheInviate> cerca(String campionatoId, short anno, Integer giornata, Enumeratori.TipoNotifica tipoNotifica) {
        return notificheInviateRepository.findByCampionato_IdAndAnnoAndGiornataAndTipoNotifica(campionatoId,anno,giornata,tipoNotifica);
    }

    @Transactional
    public NotificheInviateDTO salva(CampionatoDTO campionatoDTO) {
        NotificheInviate notificheInviate=new NotificheInviate();
        notificheInviate.setAnno(campionatoDTO.getAnnoCorrente());
        notificheInviate.setCampionato(campionatoMapper.toEntity(campionatoDTO));
        notificheInviate.setGiornata(campionatoDTO.getGiornataDaGiocare());
        notificheInviate.setTipoNotifica(Enumeratori.TipoNotifica.INIZIO_PARTITA);
        return notificheInviateMapper.toDTO( notificheInviateRepository.save(notificheInviate));
    }


}
