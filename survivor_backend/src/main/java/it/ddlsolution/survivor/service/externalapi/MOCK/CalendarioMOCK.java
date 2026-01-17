package it.ddlsolution.survivor.service.externalapi.MOCK;

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
    public List<PartitaDTO> getPartite(String sport, String campionato, int giornata, List<SquadraDTO> squadre, short anno) {
        List<PartitaMock> partiteMock = partitaMockRepository.findByCampionato_IdAndGiornataAndAnno(campionato, giornata, anno);

        return partiteMock.stream()
                .map(p -> {
                            SquadraDTO squadraCasa = getSquadraDTO(p.getCasaSigla(), campionato, squadre, anno);
                            SquadraDTO squadraFuori = getSquadraDTO(p.getFuoriSigla(), campionato, squadre, anno);
                            return PartitaDTO.builder()
                                    .sportId(sport)
                                    .campionatoId(campionato)
                                    .giornata(giornata)
                                    .orario(p.getOrario())
                                    .anno(anno)
                                    .stato(getStatoFromOrario(p.getOrario().toLocalDate()))
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

    private Enumeratori.StatoPartita getStatoFromOrario(LocalDate orario) {
        if (orario == null) {
            return Enumeratori.StatoPartita.SOSPESA;
        } else if (orario.equals(LocalDate.now())) {
            return Enumeratori.StatoPartita.IN_CORSO;
        } else if (orario.compareTo(LocalDate.now()) > 0) {
            return Enumeratori.StatoPartita.DA_GIOCARE;
        } else {
            return Enumeratori.StatoPartita.TERMINATA;
        }
    }

    @Override
    public IEnumSquadre[] getSquadre(String idCampionato, List<SquadraDTO> squadreDTO, short anno) {
        List<IEnumSquadre> squadre = new ArrayList<>(
                squadreDTO
                        .stream()
                        .filter(s -> s.getAnno() == anno)
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
