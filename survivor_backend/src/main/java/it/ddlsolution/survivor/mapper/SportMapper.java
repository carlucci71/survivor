package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.entity.Sport;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SportMapper  extends DtoMapper<SportDTO, Sport> {

    @Mapping(target = "campionati", ignore = true)
    SportDTO toDTO(Sport sport);

    @InheritInverseConfiguration
    Sport toEntity(SportDTO sportDTO);
}
