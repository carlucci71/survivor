package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Campionato;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.entity.projection.CampionatoProjection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {SportMapper.class})
public abstract class CampionatoMapper  implements DtoMapper<CampionatoDTO, Campionato> {

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", source = "squadre")
    public abstract CampionatoDTO toDTO(Campionato campionato);

    protected List<SquadraDTO> mapSquadre(List<Squadra> squadre) {
        if (squadre == null) {
            return null;
        }
        return squadre.stream()
                .map(this::mapSquadra)
                .collect(Collectors.toList());
    }

    protected SquadraDTO mapSquadra(Squadra squadra) {
        if (squadra == null) {
            return null;
        }
        SquadraDTO dto = new SquadraDTO();
        dto.setId(squadra.getId());
        dto.setSigla(squadra.getSigla());
        dto.setNome(squadra.getNome());
        // campionato viene ignorato per evitare ricorsione
        return dto;
    }

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", ignore = true)
    public abstract CampionatoDTO toDTO(CampionatoProjection campionatoProjection);

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", ignore = true)
    public abstract Campionato toEntity(CampionatoDTO campionatoDTO);
}

