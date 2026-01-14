package it.ddlsolution.survivor.service.externalapi.MOCK;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.service.SquadraService;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

@Service
@Profile(CALENDARIO_MOCK)
@Slf4j
public class CalendarioMOCK implements ICalendario {
    private final SquadraService squadraService;
    private  static Map<Enumeratori.CampionatiDisponibili, List<SquadraDTO>> squadreDisponibili;

    public CalendarioMOCK(SquadraService squadraService) {
        this.squadraService = squadraService;
        squadreDisponibili=Map.of(
                Enumeratori.CampionatiDisponibili.SERIE_A,squadraService.getSquadreByCampionatoId(Enumeratori.CampionatiDisponibili.SERIE_A.name())
        );
    }


    enum Campionato {
        SERIE_A(squadre(Enumeratori.CampionatiDisponibili.SERIE_A)),
        SERIE_B(squadre(Enumeratori.CampionatiDisponibili.SERIE_B)),
        LIGA(squadre(Enumeratori.CampionatiDisponibili.LIGA)),
        TENNIS_W(squadre(Enumeratori.CampionatiDisponibili.TENNIS_W)),
        TENNIS_AO(squadre(Enumeratori.CampionatiDisponibili.TENNIS_AO)),
        NBA_RS(squadre(Enumeratori.CampionatiDisponibili.NBA_RS));

        final Object[] squadre;

        Campionato(Object[] squadre) {
            this.squadre = squadre;
        }
    }

    private static Object[] squadre(Enumeratori.CampionatiDisponibili campionato) {
        List<SquadraDTO> squadraDTOS = squadreDisponibili.get(campionato);
        if (squadraDTOS == null || squadraDTOS.isEmpty()) {
            return new Object[0];
        }
        return squadraDTOS.stream()
                .map(SquadraDTO::getNome)
                .toArray();
    }
    @Override
    public List<PartitaDTO> getPartite(String sport, String campionato, int giornata, List<SquadraDTO> squadre, short anno) {
         return getPartiteCampionato(sport, campionato,giornata,squadre,anno);
    }


    private List<PartitaDTO> getPartiteCampionato(String sport, String campionato, int giornata, List<SquadraDTO> squadre, short anno) {
        return List.of(
                generaGiornata(sport, campionato, giornata
                        , squadre.get(0).getSigla(), squadre.get(1).getSigla(),0,1,squadre, anno)
        );
    }

    private PartitaDTO generaGiornata(String sport, String campionato, int giornata, String casa, String fuori, int golCasa, int golFuori,List<SquadraDTO> squadreCampionato, short anno) {
        LocalDateTime dataProgrammata =LocalDate.of(2025, 9, 1)
                .atStartOfDay()
                .plusWeeks(giornata);
        Enumeratori.StatoPartita statoPartita;
        if (dataProgrammata.compareTo(LocalDateTime.now()) < 0) {
            statoPartita = Enumeratori.StatoPartita.TERMINATA;
        } else {
            statoPartita = Enumeratori.StatoPartita.DA_GIOCARE;
        }
        return PartitaDTO.builder()
                .sportId(sport)
                .campionatoId(campionato)
                .giornata(giornata)
                .orario(dataProgrammata)
                .stato(statoPartita)
                .anno(anno)
                .casaSigla(getSquadraDTO(casa,campionato,squadreCampionato, anno).getSigla())
                .casaNome(getSquadraDTO(casa,campionato,squadreCampionato, anno).getNome())
                .fuoriSigla(getSquadraDTO(fuori,campionato,squadreCampionato, anno).getSigla())
                .fuoriNome(getSquadraDTO(fuori,campionato,squadreCampionato, anno).getNome())
                .scoreCasa(golCasa)
                .scoreFuori(golFuori)
                .build();

    }

    @Override
    public IEnumSquadre[] getSquadre(String idCampionato, List<SquadraDTO> squadreDTO, short anno) {
        List<IEnumSquadre> squadre = new ArrayList<>(
                squadreDTO
                        .stream()
                        .filter(s -> s.getAnno() == anno)
                        .map(m -> new IEnumSquadre() {
                            @Override
                            public String getSiglaEsterna() {
                                return (m.getSigla());
                            }

                            @Override
                            public String name() {
                                return m.getSigla();
                            }
                        })
                        .toList()
        );
        return squadre.toArray(IEnumSquadre[]::new);
    }
}
