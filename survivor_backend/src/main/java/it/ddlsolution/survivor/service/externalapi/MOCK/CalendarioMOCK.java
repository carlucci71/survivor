package it.ddlsolution.survivor.service.externalapi.MOCK;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.PartitaMock;
import it.ddlsolution.survivor.repository.PartitaMockRepository;
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

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

@Service
@Profile(CALENDARIO_MOCK)
@Slf4j
@RequiredArgsConstructor
public class CalendarioMOCK implements ICalendario {

    private final PartitaMockRepository partitaMockRepository;

    @Override
    public List<PartitaDTO> getPartite( CampionatoDTO campionatoDTO, int giornata, short anno) {
        String campionato=campionatoDTO.getId();
        List<SquadraDTO> squadre=campionatoDTO.getSquadre();
        String sport = campionatoDTO.getSport().getId();
        List<PartitaMock> partiteMock = partitaMockRepository.findByCampionato_IdAndGiornataAndAnno(campionato, giornata, anno);

        return partiteMock.stream()
                .map(p -> {
                            SquadraDTO squadraCasa = getSquadraDTO(p.getCasaSigla(), campionato, squadre);
                            SquadraDTO squadraFuori = getSquadraDTO(p.getFuoriSigla(), campionato, squadre);
                            return PartitaDTO.builder()
                                    .sportId(sport)
                                    .campionatoId(campionato)
                                    .giornata(giornata)
                                    .orario(p.getOrario())
                                    .anno(anno)
                                    .orario(p.getOrario() == null ? LocalDateTime.now() : p.getOrario())
                                    .stato(getStatoFromOrario(p.getOrario()))
                                    .casaSigla(squadraCasa.getSigla())
                                    .casaNome(squadraCasa.getNome())
                                    .fuoriSigla(squadraFuori.getSigla())
                                    .fuoriNome(squadraFuori.getNome())
                                    .scoreCasa(p.getScoreCasa())
                                    .scoreFuori(p.getScoreFuori())
                                    .build();
                        }
                ).toList();

    }

    private Enumeratori.StatoPartita getStatoFromOrario(LocalDateTime orario) {
        if (orario == null) {
            return Enumeratori.StatoPartita.SOSPESA;
        }
        LocalDateTime now = LocalDateTime.now();
        long diffMinutes = java.time.Duration.between(now, orario).toMinutes();

        if (diffMinutes < -120) {
            return Enumeratori.StatoPartita.TERMINATA;
        } else if (diffMinutes < 0) {
            return Enumeratori.StatoPartita.IN_CORSO;
        } else {
            return Enumeratori.StatoPartita.DA_GIOCARE;
        }
    }

    @Override
    public IEnumSquadre[] getSquadre(String idCampionato, List<SquadraDTO> squadreDTO) {
        List<IEnumSquadre> squadre = new ArrayList<>(
                squadreDTO
                        .stream()
                        .map(m -> new IEnumSquadre() {
                            @Override
                            public String name() {
                                return m.getSigla();
                            }

                            @Override
                            public String getSiglaEsterna() {
                                return (m.getSigla());
                            }
                        })
                        .toList()
        );
        return squadre.toArray(IEnumSquadre[]::new);
    }
}
