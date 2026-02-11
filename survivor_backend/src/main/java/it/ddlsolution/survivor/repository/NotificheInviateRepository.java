package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.NotificheInviate;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificheInviateRepository extends JpaRepository<NotificheInviate, Long> {
    Optional<NotificheInviate> findByCampionato_IdAndAnnoAndGiornataAndTipoNotifica(String id, short anno, int giornata, Enumeratori.TipoNotifica tipoNotifica);
}

