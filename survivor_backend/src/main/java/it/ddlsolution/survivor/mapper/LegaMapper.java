package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.LegaInsertDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.projection.LegaProjection;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class, GiocatoreMapper.class})
public abstract class LegaMapper implements DtoMapper<LegaDTO, Lega> {

    @Autowired
    protected GiocatoreMapper giocatoreMapper;

    @Mapping(target = "giocatori", ignore = true)
    public abstract LegaDTO toDTO(Lega lega);

    @Mapping(target = "giocatori", ignore = true)
    @Mapping(target = "giornataCorrente", ignore = true)
    @Mapping(target = "statoGiornataCorrente", ignore = true)
    public abstract LegaDTO toDTO(LegaProjection legaProjection);

    public abstract List<LegaDTO> toDTOListProjection(List<LegaProjection> legaProjection);

    @Mapping(target = "giocatoreLeghe", ignore = true)
    @Mapping(target = "giocate", ignore = true)
    public abstract Lega toEntity(LegaDTO legaDTO);


    @Mapping(target = "campionato.id", source = "campionato")
    @Mapping(target = "campionato.sport.id", source = "sport")
    public abstract Lega toEntity(LegaInsertDTO legaInsertDTO);


    @AfterMapping
    protected void mapGiocatori(@MappingTarget LegaDTO legaDTO, Lega lega) {
        if (lega.getGiocatoreLeghe() != null) {
            legaDTO.setGiocatori(lega.getGiocatoreLeghe().stream()
                    .map(gl -> {
                        // Usa il GiocatoreMapper per mappare tutti i campi comprese le giocate
                        GiocatoreDTO dto = giocatoreMapper.toDTO(gl.getGiocatore());
                        // rimuogo le info di altre leghe
                        dto.setGiocate(
                                dto.getGiocate().stream().filter(g -> g.getLegaId().equals(lega.getId())).toList()
                        );
                        dto.setStatiPerLega(dto.getStatiPerLega().entrySet().stream()
                                .filter(e -> e.getKey().equals(lega.getId()))
                                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                        );

                        dto.setRuoliPerLega(dto.getRuoliPerLega().entrySet().stream()
                                .filter(e -> e.getKey().equals(lega.getId()))
                                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                        );

                        return dto;
                    })
                    .toList());
        }
    }
}
