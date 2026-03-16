package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.ReactionGiocata;
import it.ddlsolution.survivor.exception.ManagedException;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.ReactionGiocataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReactionGiocataService {

    private static final Set<String> EMOJI_VALIDE = Set.of("👏", "😱", "🔥", "😂");

    private final ReactionGiocataRepository reactionRepository;
    private final GiocataRepository giocataRepository;
    private final GiocatoreService giocatoreService;

    /**
     * Aggiunge o cambia la reaction dell'utente corrente su una giocata.
     * Se ha già una reaction diversa, la sostituisce.
     */
    @Transactional
    public void reagisci(Long giocataId, String emoji) {
        if (!EMOJI_VALIDE.contains(emoji)) {
            throw new ManagedException("Emoji non valida: " + emoji, ManagedException.InternalCode.EMOJI_NON_VALIDA);
        }
        Giocata giocata = giocataRepository.findById(giocataId)
                .orElseThrow(() -> new ManagedException("Giocata non trovata: " + giocataId, ManagedException.InternalCode.GIOCATA_NOT_FOUND));

        Giocatore giocatore = giocatoreService.findMe();

        Optional<ReactionGiocata> existing = reactionRepository.findByGiocata_IdAndGiocatore_Id(giocataId, giocatore.getId());
        if (existing.isPresent()) {
            existing.get().setEmoji(emoji);
            reactionRepository.save(existing.get());
        } else {
            ReactionGiocata reaction = new ReactionGiocata();
            reaction.setGiocata(giocata);
            reaction.setGiocatore(giocatore);
            reaction.setEmoji(emoji);
            reactionRepository.save(reaction);
        }
    }

    /**
     * Rimuove la reaction dell'utente corrente su una giocata.
     */
    @Transactional
    public void rimuoviReaction(Long giocataId) {
        Giocatore giocatore = giocatoreService.findMe();
        reactionRepository.deleteByGiocata_IdAndGiocatore_Id(giocataId, giocatore.getId());
    }

    /**
     * Ritorna le reactions aggregate per una lista di giocataIds,
     * insieme alla reaction dell'utente corrente per ciascuna.
     * Struttura: giocataId -> { reactions: {emoji->count}, miaReaction: emoji|null }
     */
    @Transactional(readOnly = true)
    public Map<Long, ReactionSummary> getReactionsSummary(List<Long> giocataIds) {
        if (giocataIds == null || giocataIds.isEmpty()) return Map.of();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Long mioGiocatoreId = giocatoreService.findByUserId(userId).getId();

        List<ReactionGiocata> reactions = reactionRepository.findByGiocataIds(giocataIds);

        // Raggruppa per giocataId
        Map<Long, List<ReactionGiocata>> byGiocata = reactions.stream()
                .collect(Collectors.groupingBy(r -> r.getGiocata().getId()));

        return giocataIds.stream()
                .filter(id -> byGiocata.containsKey(id))
                .collect(Collectors.toMap(
                        id -> id,
                        id -> {
                            List<ReactionGiocata> list = byGiocata.get(id);
                            Map<String, Integer> conteggio = list.stream()
                                    .collect(Collectors.groupingBy(ReactionGiocata::getEmoji,
                                            Collectors.collectingAndThen(Collectors.counting(), Long::intValue)));
                            String mia = list.stream()
                                    .filter(r -> r.getGiocatore().getId().equals(mioGiocatoreId))
                                    .map(ReactionGiocata::getEmoji)
                                    .findFirst().orElse(null);
                            return new ReactionSummary(conteggio, mia);
                        }
                ));
    }

    public record ReactionSummary(Map<String, Integer> reactions, String miaReaction) {}
}
