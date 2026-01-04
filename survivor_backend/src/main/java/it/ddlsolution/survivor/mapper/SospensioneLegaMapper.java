package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.SospensioneLegaDTO;
import it.ddlsolution.survivor.dto.request.SospensioneLegaRequestDTO;
import it.ddlsolution.survivor.entity.SospensioneLega;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SospensioneLegaMapper extends DtoMapper<SospensioneLegaDTO, SospensioneLega> {

    @Mapping(source = "id.idLega", target = "idLega")
    @Mapping(source = "id.giornata", target = "giornata")
    SospensioneLegaDTO toDTO(SospensioneLega sospensioneLega);

    @Mapping(source = "idLega", target = "id.idLega")
    @Mapping(source = "giornata", target = "id.giornata")
    @Mapping(target = "lega", ignore = true)
    SospensioneLega toEntity(SospensioneLegaDTO dto);

    @Mapping(source = "idLega", target = "id.idLega")
    @Mapping(source = "giornata", target = "id.giornata")
    @Mapping(target = "lega", ignore = true)
    SospensioneLega toEntity(SospensioneLegaRequestDTO sospensioneLegaRequestDTO);

}

