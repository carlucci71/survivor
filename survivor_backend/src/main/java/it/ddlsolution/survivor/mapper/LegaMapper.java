package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.request.LegaInsertDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.projection.LegaProjection;
import it.ddlsolution.survivor.repository.TrofeiRepository;
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

import java.util.Comparator;
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
    @Autowired
    private TrofeiRepository trofeiRepository;

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
            List<GiocatoreDTO> giocatori = lega.getGiocatoreLeghe().stream()
                    .map(gl -> {
                        // Usa il GiocatoreMapper per mappare tutti i campi comprese le giocate
                        GiocatoreDTO dto = giocatoreMapper.toDTO(gl.getGiocatore());
                        // rimuogo le info di altre leghe
                        dto.setGiocate(
                                dto.getGiocate().stream()
                                        .filter(g -> g.getLegaId().equals(lega.getId()))
                                        .sorted(Comparator.comparing(GiocataDTO::getGiornata))
                                        .toList()
                        );
                        dto.setStatiPerLega(dto.getStatiPerLega().entrySet().stream()
                                .filter(e -> e.getKey().equals(lega.getId()))
                                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                        );

                        dto.setRuoliPerLega(dto.getRuoliPerLega().entrySet().stream()
                                .filter(e -> e.getKey().equals(lega.getId()))
                                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                        );

                        // Imposta i punti totali della lega corrente (modalità Campionato)
                        dto.setPuntiTotali(gl.getPuntiTotali());

                        return dto;
                    })
                    .toList();

            // Badge storico: 3 query batched (non una per giocatore) su tutta la lista
            List<Long> giocatoreIds = giocatori.stream().map(GiocatoreDTO::getId).toList();
            if (!giocatoreIds.isEmpty()) {
                Map<Long, Long> vittorie1v1 = mappaConteggiPerGiocatore(trofeiRepository.countVittorie1v1ByGiocatoreIds(giocatoreIds));
                Map<Long, Long> vittorieSurvivor = mappaConteggiPerGiocatore(trofeiRepository.countVittorieSurvivorByGiocatoreIds(giocatoreIds));
                Map<Long, Long> vittorieCampionato = mappaConteggiPerGiocatore(trofeiRepository.countVittorieCampionatoByGiocatoreIds(giocatoreIds));
                giocatori.forEach(dto -> {
                    dto.setVittorie1v1(vittorie1v1.getOrDefault(dto.getId(), 0L));
                    dto.setVittorieSurvivor(vittorieSurvivor.getOrDefault(dto.getId(), 0L));
                    dto.setVittorieCampionato(vittorieCampionato.getOrDefault(dto.getId(), 0L));
                });
            }

            legaDTO.setGiocatori(giocatori);
        }
        legaDTO.setNumPartecipanti(lega.getGiocatoreLeghe() != null ? lega.getGiocatoreLeghe().size() : 0);
    }

    private Map<Long, Long> mappaConteggiPerGiocatore(List<Object[]> righe) {
        return righe.stream().collect(Collectors.toMap(
                riga -> (Long) riga[0],
                riga -> (Long) riga[1]
        ));
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
