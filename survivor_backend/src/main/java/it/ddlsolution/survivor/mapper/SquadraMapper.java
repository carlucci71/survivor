package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class})
public interface SquadraMapper  extends DtoMapper<SquadraDTO, Squadra> {
}

