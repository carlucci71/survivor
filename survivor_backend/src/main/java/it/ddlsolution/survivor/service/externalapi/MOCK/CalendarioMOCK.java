package it.ddlsolution.survivor.service.externalapi.MOCK;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import it.ddlsolution.survivor.util.enums.SquadreLiga;
import it.ddlsolution.survivor.util.enums.SquadreNBA;
import it.ddlsolution.survivor.util.enums.SquadreSerieA;
import it.ddlsolution.survivor.util.enums.SquadreSerieB;
import it.ddlsolution.survivor.util.enums.SquadreTennis;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

@Service
@Profile(CALENDARIO_MOCK)
@Slf4j
@RequiredArgsConstructor
public class CalendarioMOCK implements ICalendario {

    enum Campionato {
        SERIE_A(SquadreSerieA.values()),
        SERIE_B(SquadreSerieB.values()),
        LIGA(SquadreLiga.values()),
        TENNIS_W(SquadreTennis.values()),
        TENNIS_AO(SquadreTennis.values()),
        NBA_RS(SquadreNBA.values());

        final Object[] squadre;

        Campionato(Object[] squadre) {
            this.squadre = squadre;
        }

    }

    @Override
    public List<PartitaDTO> getPartite(String sport, String campionato, int giornata, List<SquadraDTO> squadre) {
        return List.of(
                generaGiornata(sport, campionato, giornata, SquadreSerieA.ATA.name(), SquadreSerieA.BOL.name(),0,1,squadre)
        );
    }
    private PartitaDTO generaGiornata(String sport, String campionato, int giornata, String casa, String fuori, int golCasa, int golFuori,List<SquadraDTO> squadreCampionato) {
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
//                .casaSigla(casa)
//                .fuoriSigla(fuori)
                .casaSigla(getSquadraDTO(casa,campionato,squadreCampionato).getSigla())
                .casaNome(getSquadraDTO(casa,campionato,squadreCampionato).getNome())
                .fuoriSigla(getSquadraDTO(fuori,campionato,squadreCampionato).getSigla())
                .fuoriNome(getSquadraDTO(fuori,campionato,squadreCampionato).getNome())


                .scoreCasa(golCasa)
                .scoreFuori(golFuori)
                .build();

    }

    @Override
    public IEnumSquadre[] getSquadre(String idCampionato) {
        return Arrays.stream(Campionato.valueOf(idCampionato).squadre)
                .map(m -> new IEnumSquadre() {
                    @Override
                    public String getSigla() {
                        return ((Enum<?>) m).name();
                    }

                    @Override
                    public String name() {
                        return ((Enum<?>) m).name();
                    }
                })
                .toArray(IEnumSquadre[]::new);
    }
}
