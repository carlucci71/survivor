package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.PushToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}
