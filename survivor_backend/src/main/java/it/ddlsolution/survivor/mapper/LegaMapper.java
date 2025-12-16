package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.entity.Lega;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class, GiocatoreMapper.class})
public interface LegaMapper extends DtoMapper<LegaDTO, Lega> {
}

