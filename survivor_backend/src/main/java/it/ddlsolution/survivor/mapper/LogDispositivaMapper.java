package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.LogDispositivaDTO;
import it.ddlsolution.survivor.entity.LogDispositiva;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {UserMapper.class, ParamLogDispositivaMapper.class})
public interface LogDispositivaMapper extends DtoMapper<LogDispositivaDTO, LogDispositiva> {
}

