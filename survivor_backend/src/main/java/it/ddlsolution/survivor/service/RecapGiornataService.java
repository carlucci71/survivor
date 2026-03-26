package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.PushNotificationDTO;
import it.ddlsolution.survivor.dto.RecapGiornataDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.ReactionGiocata;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocatoreLegaRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.ReactionGiocataRepository;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecapGiornataService {

    private final LegaRepository legaRepository;
    private final GiocatoreLegaRepository giocatoreLegaRepository;
    private final GiocataRepository giocataRepository;
    private final ReactionGiocataRepository reactionGiocataRepository;
    private final PushNotificationService pushNotificationService;

    /**
     * Costruisce il recap per una giornata specifica di una lega.
     *
     * @param legaId   id della lega
     * @param giornata giornata RELATIVA alla lega (1, 2, 3…)
     */
    @Transactional(readOnly = true)
    public RecapGiornataDTO getRecap(Long legaId, Integer giornata) {

        Lega lega = legaRepository.findById(legaId)
                .orElseThrow(() -> new RuntimeException("Lega non trovata: " + legaId));

        // giornata assoluta nel campionato (usata solo per l'output del DTO)
        int giornataAssoluta = giornata + lega.getGiornataIniziale() - 1;

        // Tutti i partecipanti della lega con il loro stato corrente
        List<GiocatoreLega> partecipanti = giocatoreLegaRepository.findByLega_Id(legaId);

        // Tutte le giocate di questa giornata (relativa) per la lega — una query bulk
        List<Giocata> giocateRound = giocataRepository.findByGiornataAndLega_Id(giornata, legaId);
        Map<Long, Giocata> giocataPerGiocatoreId = giocateRound.stream()
                .collect(Collectors.toMap(g -> g.getGiocatore().getId(), g -> g));

        // Bulk-load reactions per tutte le giocate di questo round
        List<Long> giocataIds = giocateRound.stream().map(Giocata::getId).toList();
        List<ReactionGiocata> reactions = giocataIds.isEmpty()
                ? List.of()
                : reactionGiocataRepository.findByGiocataIds(giocataIds);
        Map<Long, Long> reactionCountPerGiocata = reactions.stream()
                .collect(Collectors.groupingBy(r -> r.getGiocata().getId(), Collectors.counting()));

        List<RecapGiornataDTO.PickEntry> picks = new ArrayList<>();

        for (GiocatoreLega gl : partecipanti) {
            Long giocatoreId = gl.getGiocatore().getId();
            String nickname = gl.getGiocatore().getNickname();
            Enumeratori.StatoGiocatore statoAttuale = gl.getStato();

            Giocata giocata = giocataPerGiocatoreId.get(giocatoreId);

            // Era già eliminato (KO in una giornata precedente) → non è una nuova eliminazione questa giornata
            boolean eraGiaEliminato = giocataRepository
                    .existsByGiocatore_IdAndLega_IdAndGiornataLessThanAndEsito(
                            giocatoreId, legaId, giornata, Enumeratori.EsitoGiocata.KO);

            boolean eliminatoQuestaGiornata = !eraGiaEliminato
                    && statoAttuale == Enumeratori.StatoGiocatore.ELIMINATO
                    && giocata != null
                    && Enumeratori.EsitoGiocata.KO == giocata.getEsito();

            String squadraNome = (giocata != null && giocata.getSquadra() != null)
                    ? giocata.getSquadra().getNome() : null;
            String squadraSigla = (giocata != null && giocata.getSquadra() != null)
                    ? giocata.getSquadra().getSigla() : null;

            picks.add(RecapGiornataDTO.PickEntry.builder()
                    .nickname(nickname)
                    .squadraNome(squadraNome)
                    .squadraSigla(squadraSigla)
                    .esito(giocata != null ? giocata.getEsito() : null)
                    .statoDopoGiornata(statoAttuale)
                    .eliminatoQuestaGiornata(eliminatoQuestaGiornata)
                    .forzata(giocata != null && giocata.getForzatura() != null
                            && !giocata.getForzatura().isBlank())
                    .build());
        }

        // Ordina: sopravvissuti → eliminati questa giornata → resto
        picks.sort(Comparator
                .comparing((RecapGiornataDTO.PickEntry p) ->
                        p.getStatoDopoGiornata() == Enumeratori.StatoGiocatore.ATTIVO ? 0
                                : (p.isEliminatoQuestaGiornata() ? 1 : 2))
                .thenComparing(p -> p.getNickname() != null ? p.getNickname() : ""));

        long sopravvissuti = picks.stream()
                .filter(p -> p.getStatoDopoGiornata() == Enumeratori.StatoGiocatore.ATTIVO)
                .count();

        long eliminatiQuesta = picks.stream()
                .filter(RecapGiornataDTO.PickEntry::isEliminatoQuestaGiornata)
                .count();

        long totaleEliminati = picks.stream()
                .filter(p -> p.getStatoDopoGiornata() == Enumeratori.StatoGiocatore.ELIMINATO)
                .count();

        // stats: squadra più scelta
        Map<String, Long> countPerSquadra = picks.stream()
                .filter(p -> p.getSquadraNome() != null)
                .collect(Collectors.groupingBy(RecapGiornataDTO.PickEntry::getSquadraNome, Collectors.counting()));

        String squadraPiuScelta = null;
        int quantiPiuScelta = 0;
        for (Map.Entry<String, Long> entry : countPerSquadra.entrySet()) {
            if (entry.getValue() > quantiPiuScelta) {
                quantiPiuScelta = entry.getValue().intValue();
                squadraPiuScelta = entry.getKey();
            }
        }

        // stats: pick con più reazioni
        String pickPiuReagito = null;
        int maxReazioni = 0;
        for (GiocatoreLega gl : partecipanti) {
            Giocata giocata = giocataPerGiocatoreId.get(gl.getGiocatore().getId());
            if (giocata != null) {
                int totReazioni = reactionCountPerGiocata.getOrDefault(giocata.getId(), 0L).intValue();
                if (totReazioni > maxReazioni) {
                    maxReazioni = totReazioni;
                    pickPiuReagito = gl.getGiocatore().getNickname();
                }
            }
        }

        RecapGiornataDTO.StatGiornata stats = RecapGiornataDTO.StatGiornata.builder()
                .squadraPiuScelta(squadraPiuScelta)
                .quanti(quantiPiuScelta)
                .pickPiuReagito(maxReazioni > 0 ? pickPiuReagito : null)
                .reazioni(maxReazioni)
                .build();

        String campionatoNome = null;
        String sportNome = null;
        if (lega.getCampionato() != null) {
            campionatoNome = lega.getCampionato().getNome();
            if (lega.getCampionato().getSport() != null) {
                sportNome = lega.getCampionato().getSport().getNome();
            }
        }

        return RecapGiornataDTO.builder()
                .legaId(legaId)
                .legaNome(lega.getName())
                .edizione(lega.getEdizione())
                .giornata(giornataAssoluta)
                .giornataRelativa(giornata)
                .campionatoNome(campionatoNome)
                .sport(sportNome)
                .totaleMembri(picks.size())
                .sopravvissuti((int) sopravvissuti)
                .eliminatiQuestaGiornata((int) eliminatiQuesta)
                .totaleEliminati((int) totaleEliminati)
                .picks(picks)
                .stats(stats)
                .build();
    }

    /**
     * Invia la notifica RECAP_GIORNATA a tutti i membri della lega (attivi e non).
     */
    public void inviaNotificaRecap(LegaDTO lega, Integer giornataRelativa) {
        try {
            List<GiocatoreDTO> giocatori = lega.getGiocatori() != null ? lega.getGiocatori() : List.of();

            List<Long> userIds = giocatori.stream()
                    .filter(g -> g.getUser() != null && g.getUser().getId() != null)
                    .map(g -> g.getUser().getId())
                    .toList();

            if (userIds.isEmpty()) return;

            int giornataAssoluta = giornataRelativa + lega.getGiornataIniziale() - 1;

            long sopravvissuti = giocatori.stream()
                    .filter(g -> g.getStatiPerLega().get(lega.getId()) == Enumeratori.StatoGiocatore.ATTIVO)
                    .count();

            PushNotificationDTO dto = PushNotificationDTO.builder()
                    .title("🏆 Giornata " + giornataRelativa + " — " + lega.getName())
                    .body("Risultati pronti! " + sopravvissuti + " sopravvissuti ancora in gara.")
                    .tipoNotifica(Enumeratori.TipoNotifica.RECAP_GIORNATA)
                    .expiringAt(LocalDateTime.now().plusDays(3))
                    .legaId(lega.getId())
                    .giornata(giornataRelativa)
                    .build();

            pushNotificationService.sendNotificationToUsers(userIds, dto);
            log.info("Notifica RECAP_GIORNATA inviata a {} utenti per lega {} giornata {}",
                    userIds.size(), lega.getId(), giornataRelativa);
        } catch (Exception e) {
            log.warn("Errore invio notifica recap lega {} giornata {}: {}", lega.getId(), giornataRelativa, e.getMessage());
        }
    }
}
