package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.entity.Giocata;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {GiocatoreMapper.class, SquadraMapper.class})
public interface GiocataMapper  extends DtoMapper<GiocataDTO, Giocata> {

    @Mapping(source = "giocatore.id", target = "giocatoreId")
    @Mapping(source = "lega.id", target = "legaId")
    @Mapping(source = "squadra.id", target = "squadraId")
    GiocataDTO toDTO(Giocata giocata);

    @InheritInverseConfiguration
    Giocata toEntity(GiocataDTO giocataDTO);
}

