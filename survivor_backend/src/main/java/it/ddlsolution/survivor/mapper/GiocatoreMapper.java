package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.GiocatoreProjection;
import it.ddlsolution.survivor.entity.Giocatore;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {GiocataMapper.class, UserMapper.class})
public interface GiocatoreMapper  extends DtoMapper<GiocatoreDTO, Giocatore> {

    @Mapping(target = "leghe", ignore = true)
    GiocatoreDTO toDTO(Giocatore giocatoreDTO);

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "giocate", ignore = true)
    GiocatoreDTO projectionToDTO(GiocatoreProjection projection);

    @InheritInverseConfiguration
    Giocatore toEntity(GiocatoreDTO giocatoreDTO);

}

