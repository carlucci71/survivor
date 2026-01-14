package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public interface ICalendario {
    //LISTA DELLE PARTITE DI UNA GIORNATA
    List<PartitaDTO> getPartite(String sport, String campionato, int giornata, List<SquadraDTO> squadre, short anno);
    //SQUADRE DI UN CAMPIONATO (SIGLA E NOME)
    IEnumSquadre[] getSquadre(String idCampionato);

    default SquadraDTO getSquadraDTO(String squadraSigla, String idCampionato, List<SquadraDTO> squadreDTO) {
        Map<String, String> mapForAdapt = Arrays.stream(getSquadre(idCampionato))
                .collect(Collectors.toMap(IEnumSquadre::getSigla, IEnumSquadre::name)
                );
        SquadraDTO squadraDTO;
        try {
            squadraDTO = squadreDTO.stream().filter(s -> s.getSigla().equals(mapForAdapt.get(squadraSigla))).findFirst()
                    .orElseThrow(() -> new RuntimeException("Squadra da configurare: " + squadraSigla)
                    );
        } catch (Exception e) {
            String upperCase = squadraSigla.replaceAll(" ", "_").replaceAll("-", "").toUpperCase();
            System.out.println("******-> " + upperCase + "\"" + squadraSigla + "\"");
            System.out.println("******-> " + " insert into squadra (sigla, nome, id_campionato) values ('" + squadraSigla + "','" + upperCase + "','" + idCampionato + "');"  );
            throw new RuntimeException(e);
        }
        return squadraDTO;
    }


}
