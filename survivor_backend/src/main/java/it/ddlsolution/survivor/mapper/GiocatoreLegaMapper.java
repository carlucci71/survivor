package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocatoreLegaDTO;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface GiocatoreLegaMapper extends DtoMapper<GiocatoreLegaDTO, GiocatoreLega> {

    @Mapping(source = "id.idGiocatore", target = "idGiocatore")
    @Mapping(source = "id.idLega", target = "idLega")
    @Mapping(source = "giocatore.nickname", target = "nomeGiocatore")
    @Mapping(source = "lega.name", target = "nomeLega")
    GiocatoreLegaDTO toDTO(GiocatoreLega giocatoreLega);

    @Mapping(source = "idGiocatore", target = "id.idGiocatore")
    @Mapping(source = "idLega", target = "id.idLega")
    @Mapping(target = "giocatore", ignore = true)
    @Mapping(target = "lega", ignore = true)
    GiocatoreLega toEntity(GiocatoreLegaDTO dto);
}

