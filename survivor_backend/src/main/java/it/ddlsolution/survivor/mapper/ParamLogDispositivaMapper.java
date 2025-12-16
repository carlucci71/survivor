package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.ParamLogDispositivaDTO;
import it.ddlsolution.survivor.entity.ParamLogDispositiva;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ParamLogDispositivaMapper extends DtoMapper<ParamLogDispositivaDTO, ParamLogDispositiva> {
}

