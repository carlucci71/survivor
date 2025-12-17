package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class, GiocatoreMapper.class})
public abstract class LegaMapper implements DtoMapper<LegaDTO, Lega> {

    @Autowired
    protected GiocatoreMapper giocatoreMapper;

    @Mapping(target = "giocatori", ignore = true)
    public abstract LegaDTO toDTO(Lega lega);

    @Mapping(target = "giocatoreLeghe", ignore = true)
    @Mapping(target = "giocate", ignore = true)
    public abstract Lega toEntity(LegaDTO legaDTO);

    @AfterMapping
    protected void mapGiocatori(@MappingTarget LegaDTO legaDTO, Lega lega) {
        if (lega.getGiocatoreLeghe() != null) {
            legaDTO.setGiocatori(lega.getGiocatoreLeghe().stream()
                .map(gl -> {
                    // Usa il GiocatoreMapper per mappare tutti i campi comprese le giocate
                    GiocatoreDTO dto = giocatoreMapper.toDTO(gl.getGiocatore());
                    // Aggiungi lo stato specifico per questa lega
                    dto.getStatiPerLega().put(lega.getId(), gl.getStato());
                    return dto;
                })
                .toList());
        }
    }
}

