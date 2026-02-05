package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class GiocatoreDTO {
    private Long id;
    private String nickname;
    private SquadraDTO squadraCuore;
    private Map<Long, Enumeratori.StatoGiocatore> statiPerLega = new HashMap<>();
    private Map<Long, Enumeratori.RuoloGiocatoreLega> ruoliPerLega = new HashMap<>();
    private List<GiocataDTO> giocate;
    private UserDTO user;
    private List<LegaDTO> leghe = new ArrayList<>();

}

