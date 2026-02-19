package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.PushToken;
import it.ddlsolution.survivor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PushTokenRepository extends JpaRepository<PushToken, Long> {

    Optional<PushToken> findByTokenAndUser_Id(String token, Long userId);

    List<PushToken> findByUser_IdAndActiveTrue(Long userId);

    List<PushToken> findByUser_IdInAndActiveTrue(List<Long> userIds);

    @Modifying
    @Query("UPDATE PushToken pt SET pt.active = false WHERE pt.token = :token")
    int deactivateByToken(@Param("token") String token);

    @Modifying
    @Query("UPDATE PushToken pt SET pt.active = false WHERE pt.user.id = :userId")
    int deactivateAllByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE PushToken pt SET pt.active = false WHERE pt.active = true")
    int deactivateAllTokens();

    @Transactional
    @Modifying
    @Query("update PushToken p set p.active = false where p.platform = ?1 and p.user = ?2 and p.deviceId = ?3")
    int dectivateTokenOfPlatformAndUserAndDeviceId(String platform, User user, String deviceId);

}
