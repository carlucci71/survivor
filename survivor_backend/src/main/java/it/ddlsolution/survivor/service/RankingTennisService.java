package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.RankingTennisDTO;
import it.ddlsolution.survivor.util.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankingTennisService {

    private final Utility utility;

    @Value("${external-api.ranking.tennis.atp-url}")
    private String atpRankingUrl;

    @SuppressWarnings("unchecked")
    public List<RankingTennisDTO> getRankingAtp() {
        log.info("Recupero ranking ATP da: {}", atpRankingUrl);
        Map<String, Object> response = utility.callUrl(atpRankingUrl, Map.class);
        Map<String, Object> data = (Map<String, Object>) response.get("data");
        List<Map<String, Object>> players = (List<Map<String, Object>>) data.get("players");

        List<RankingTennisDTO> result = new ArrayList<>();
        for (Map<String, Object> player : players) {
            RankingTennisDTO dto = new RankingTennisDTO();
            dto.setId(player.get("id").toString());
            dto.setDisplayName(player.get("displayName").toString());
            dto.setFirstName(player.get("firstName").toString());
            dto.setLastName(player.get("lastName").toString());
            dto.setNationality(player.get("nationality").toString());
            dto.setRank((Integer) player.get("rank"));
            dto.setPoints((Integer) player.get("points"));
            result.add(dto);
        }
        return result;
    }
}
