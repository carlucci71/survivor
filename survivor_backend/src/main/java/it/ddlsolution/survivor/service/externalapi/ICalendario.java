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
    IEnumSquadre[] getSquadre(String idCampionato, List<SquadraDTO> squadreDTO, short anno);

    default SquadraDTO getSquadraDTO(String squadraSiglaExternal, String idCampionato, List<SquadraDTO> squadreDTO, short anno) {
        //In mapForAdapt ho Mappa con chiave
        Map<String, String> mapForAdapt = Arrays.stream(getSquadre(idCampionato,squadreDTO,anno))
                .collect(Collectors.toMap(IEnumSquadre::getSiglaEsterna, IEnumSquadre::name)
                );
        SquadraDTO squadraDTO;
        try {
            squadraDTO = squadreDTO.stream()
                    .filter(s ->  s.getSigla().equals(mapForAdapt.get(squadraSiglaExternal)))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Squadra da configurare: " + squadraSiglaExternal + " per il campionato: " + idCampionato + " e anno: " + anno)
                    );
        } catch (Exception e) {
            String upperCase = squadraSiglaExternal.replaceAll(" ", "_").replaceAll("-", "").toUpperCase();
            System.out.println("******-> " + upperCase + "\"" + squadraSiglaExternal + "\"");
            System.out.println("******-> " + " insert into squadra (sigla, nome, id_campionato) values ('" + squadraSiglaExternal + "','" + upperCase + "','" + idCampionato + "');"  );
            throw new RuntimeException(e);
        }
        return squadraDTO;
    }


}
