package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.request.LegaInsertDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.projection.LegaProjection;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class, GiocatoreMapper.class})
public abstract class LegaMapper implements DtoMapper<LegaDTO, Lega> {

    @Autowired
    protected GiocatoreMapper giocatoreMapper;
    @Autowired
    private CampionatoService campionatoService;

    @Mapping(target = "giocatori", ignore = true)
    @Mapping(target = "withPwd", source = ".", qualifiedByName = "hasPwdLega")
    public abstract LegaDTO toDTO(Lega lega);

    @Mapping(target = "giocatori", ignore = true)
    @Mapping(target = "giornataCorrente", ignore = true)
    @Mapping(target = "statoGiornataCorrente", ignore = true)
    @Mapping(target = "withPwd", source = ".", qualifiedByName = "hasPwdLegaProjection")
    public abstract LegaDTO toDTO(LegaProjection legaProjection);

    public abstract List<LegaDTO> toDTOListProjection(List<LegaProjection> legaProjection);

    @Mapping(target = "giocatoreLeghe", ignore = true)
    @Mapping(target = "giocate", ignore = true)
    public abstract Lega toEntity(LegaDTO legaDTO);


    @Mapping(target = "campionato.id", source = "campionato")
    @Mapping(target = "campionato.sport.id", source = "sport")
    @Mapping(target = "stato", expression = "java(valorizzaStatoDaAvviare())")
    public abstract Lega toEntity(LegaInsertDTO legaInsertDTO);

    @Named("hasPwdLegaProjection")
    protected boolean hasPwdLegaProjection(LegaProjection legaProjection) {
        return !ObjectUtils.isEmpty(legaProjection.getPwd());
    }

    @Named("hasPwdLega")
    protected boolean hasPwdLega(Lega lega) {
        return !ObjectUtils.isEmpty(lega.getPwd());
    }

    @AfterMapping
    protected void mapGiocatori(@MappingTarget LegaDTO legaDTO, Lega lega) {


        // Cerca il campionato corrispondente in modo sicuro (evita .get() su Optional)
        if (lega != null && lega.getCampionato() != null && lega.getCampionato().getId() != null) {
            Optional<CampionatoDTO> campOpt = campionatoService.allCampionati()
                    .stream()
                    .filter(c -> c.getId().equals(lega.getCampionato().getId()))
                    .findFirst();
            campOpt.ifPresent(legaDTO::setCampionato);
        }


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

    @Named("valorizzaStatoDaAvviare")
    Enumeratori.StatoLega valorizzaStatoDaAvviare() {
        return it.ddlsolution.survivor.util.enums.Enumeratori.StatoLega.DA_AVVIARE;
    }

    @AfterMapping
    protected void mapGiocatori(@MappingTarget LegaDTO legaDTO, LegaProjection lega) {

        if (lega != null && lega.getCampionato() != null && lega.getCampionato().getId() != null) {
            Optional<CampionatoDTO> campOpt = campionatoService.allCampionati()
                    .stream()
                    .filter(c -> c.getId().equals(lega.getCampionato().getId()))
                    .findFirst();
            campOpt.ifPresent(legaDTO::setCampionato);
        }
    }


}
