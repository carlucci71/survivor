package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.projection.GiocatoreProjection;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.mapstruct.AfterMapping;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {GiocataMapper.class, UserMapper.class})
public abstract class GiocatoreMapper  implements DtoMapper<GiocatoreDTO, Giocatore> {

    @Mapping(target = "leghe", ignore = true)
    public abstract GiocatoreDTO toDTO(Giocatore giocatoreDTO);

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "giocate", ignore = true)
    public abstract GiocatoreDTO projectionToDTO(GiocatoreProjection projection);

    @InheritInverseConfiguration
    public abstract Giocatore toEntity(GiocatoreDTO giocatoreDTO);

    @AfterMapping
    protected void mapGiocatori(@MappingTarget GiocatoreDTO giocatoreDTO, Giocatore giocatore) {
        giocatore.getGiocatoreLeghe().stream()
                .forEach(gl -> {

                    Long idLega = gl.getLega().getId();
                    Enumeratori.StatoGiocatore stato = gl.getStato();
                    Enumeratori.RuoloGiocatoreLega ruolo = gl.getRuolo();


                    // Aggiungi lo stato specifico per questa giocatore
                    giocatoreDTO.getStatiPerLega().put(idLega, stato);
                    giocatoreDTO.getRuoliPerLega().put(idLega, ruolo);
                });

    }



}

