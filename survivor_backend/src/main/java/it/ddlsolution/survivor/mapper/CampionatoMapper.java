package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.entity.Campionato;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {SportMapper.class, LegaMapper.class, SquadraMapper.class})
public interface CampionatoMapper {

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", ignore = true)
    CampionatoDTO toDTO(Campionato campionato);

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", ignore = true)
    Campionato toEntity(CampionatoDTO campionatoDTO);

    List<CampionatoDTO> toDTOList(List<Campionato> campionati);

    List<Campionato> toEntityList(List<CampionatoDTO> campionatoDTOs);
}

