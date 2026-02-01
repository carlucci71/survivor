package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.ParametriDTO;
import it.ddlsolution.survivor.entity.Parametri;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ParametriMapper extends DtoMapper<ParametriDTO, Parametri> {
}
