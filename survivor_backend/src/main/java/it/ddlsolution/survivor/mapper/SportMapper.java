package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.entity.Sport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class})
public interface SportMapper {

    @Mapping(target = "campionati", ignore = true)
    SportDTO toDTO(Sport sport);

    @Mapping(target = "campionati", ignore = true)
    Sport toEntity(SportDTO sportDTO);

    List<SportDTO> toDTOList(List<Sport> sports);

    List<Sport> toEntityList(List<SportDTO> sportDTOs);
}
