package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.FotoSegnalataDTO;
import it.ddlsolution.survivor.entity.FotoSegnalazione;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.GiocatoreFoto;
import it.ddlsolution.survivor.exception.ManagedException;
import it.ddlsolution.survivor.repository.FotoSegnalazioneRepository;
import it.ddlsolution.survivor.repository.GiocatoreFotoRepository;
import it.ddlsolution.survivor.repository.GiocatoreLegaRepository;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Foto profilo dei giocatori. Regole:
 * <ul>
 *   <li>il file arriva dal client gia' ritagliato, ma qui viene SEMPRE decodificato e ricodificato (JPEG 256x256):
 *       scarta file non immagine, toglie metadati (EXIF/GPS) e qualunque contenuto nascosto nel file originale;</li>
 *   <li>la foto la vede solo chi condivide almeno una lega col giocatore (e il giocatore stesso, e gli admin);</li>
 *   <li>moderazione richiesta dagli store per i contenuti generati dagli utenti: ogni giocatore puo' segnalare la
 *       foto di un altro (e da quel momento non la vede piu'); a {@link #SOGLIA_AUTO_NASCONDI} segnalazioni la foto
 *       sparisce per tutti in attesa di un admin, che puo' rimuoverla (anche vietando nuovi caricamenti) o ripristinarla.</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FotoProfiloService {

    /** Lato (px) della foto salvata: basta e avanza per un avatar, e tiene il file sui 20-40 KB. */
    static final int LATO = 256;
    /** Oltre questa dimensione (px) per lato il file originale viene rifiutato: protegge da immagini "bomba". */
    static final int MAX_PIXEL = 4096;
    static final int MIN_PIXEL = 32;
    /** Quante segnalazioni distinte servono a nascondere la foto a tutti in attesa di un admin. */
    public static final int SOGLIA_AUTO_NASCONDI = 3;

    private final GiocatoreRepository giocatoreRepository;
    private final GiocatoreFotoRepository fotoRepository;
    private final FotoSegnalazioneRepository segnalazioneRepository;
    private final GiocatoreLegaRepository giocatoreLegaRepository;

    // ─── UTENTE: la mia foto ────────────────────────────────────────────────

    /** Salva (o sostituisce) la foto del giocatore corrente e ne restituisce la nuova versione. */
    @Transactional
    public Long carica(byte[] originale) {
        Giocatore giocatore = giocatoreCorrente();
        GiocatoreFoto esistente = fotoRepository.findById(giocatore.getId()).orElse(null);
        if (esistente != null && esistente.isBloccata()) {
            throw new ManagedException("Non puoi caricare una foto profilo", ManagedException.InternalCode.FOTO_BLOCCATA);
        }

        byte[] normalizzata = normalizza(originale);

        GiocatoreFoto foto = esistente != null ? esistente : new GiocatoreFoto();
        foto.setGiocatoreId(giocatore.getId());
        foto.setData(normalizzata);
        foto.setUpdatedAt(LocalDateTime.now());
        foto.setNascosta(false);
        fotoRepository.save(foto);

        // Contenuto nuovo: le vecchie segnalazioni riguardavano un'altra foto
        segnalazioneRepository.deleteByGiocatoreId(giocatore.getId());

        giocatore.setFotoVersion(versione(foto.getUpdatedAt()));
        giocatoreRepository.save(giocatore);
        log.info("Foto profilo caricata per giocatore {} ({} byte)", giocatore.getId(), normalizzata.length);
        return giocatore.getFotoVersion();
    }

    /** Toglie la foto del giocatore corrente (torna alle iniziali). Resta traccia solo di un eventuale blocco admin. */
    @Transactional
    public void rimuoviMia() {
        Giocatore giocatore = giocatoreCorrente();
        eliminaFoto(giocatore, false);
    }

    // ─── Lettura ────────────────────────────────────────────────────────────

    /**
     * Bytes della foto di {@code targetId} se il richiedente e' autorizzato a vederla; vuoto altrimenti (nessuna foto,
     * nascosta, segnalata dal richiedente, o nessuna lega in comune). Mai un errore: il frontend mostra le iniziali.
     */
    @Transactional(readOnly = true)
    public Optional<byte[]> leggi(Long targetId) {
        GiocatoreFoto foto = fotoRepository.findById(targetId).orElse(null);
        if (foto == null || foto.getData() == null) return Optional.empty();

        if (isAdmin()) return Optional.of(foto.getData());
        if (foto.isNascosta()) return Optional.empty();

        Giocatore richiedente = giocatoreCorrente();
        if (richiedente.getId().equals(targetId)) return Optional.of(foto.getData());

        if (giocatoreLegaRepository.countLegheInComune(richiedente.getId(), targetId) == 0) return Optional.empty();
        if (segnalazioneRepository.existsByGiocatoreIdAndSegnalatoreId(targetId, richiedente.getId())) return Optional.empty();
        return Optional.of(foto.getData());
    }

    // ─── Segnalazione ───────────────────────────────────────────────────────

    /** Segnala la foto di un altro giocatore (da quel momento il segnalatore non la vede piu'). */
    @Transactional
    public void segnala(Long targetId) {
        Giocatore segnalatore = giocatoreCorrente();
        if (segnalatore.getId().equals(targetId)) {
            throw new ManagedException("Non puoi segnalare la tua foto", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }
        GiocatoreFoto foto = fotoRepository.findById(targetId).orElse(null);
        if (foto == null || foto.getData() == null
                || giocatoreLegaRepository.countLegheInComune(segnalatore.getId(), targetId) == 0) {
            throw new ManagedException("Foto non trovata", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }
        if (segnalazioneRepository.existsByGiocatoreIdAndSegnalatoreId(targetId, segnalatore.getId())) {
            return; // gia' segnalata: nessun errore, l'effetto per lui e' lo stesso
        }

        FotoSegnalazione s = new FotoSegnalazione();
        s.setGiocatoreId(targetId);
        s.setSegnalatoreId(segnalatore.getId());
        segnalazioneRepository.save(s);

        long totale = segnalazioneRepository.countByGiocatoreId(targetId);
        log.warn("Foto profilo del giocatore {} segnalata da {} (segnalazioni: {})", targetId, segnalatore.getId(), totale);
        if (totale >= SOGLIA_AUTO_NASCONDI && !foto.isNascosta()) {
            foto.setNascosta(true);
            fotoRepository.save(foto);
            giocatoreRepository.findById(targetId).ifPresent(g -> {
                g.setFotoVersion(null);
                giocatoreRepository.save(g);
            });
            log.warn("Foto profilo del giocatore {} nascosta in automatico: servono le verifiche di un admin", targetId);
        }
    }

    // ─── ADMIN ──────────────────────────────────────────────────────────────

    /** Giocatori con segnalazioni aperte, foto nascosta o caricamento bloccato (piu' segnalati per primi). */
    @Transactional(readOnly = true)
    public List<FotoSegnalataDTO> segnalate() {
        Set<Long> ids = new LinkedHashSet<>(segnalazioneRepository.findGiocatoriSegnalati());
        fotoRepository.findByNascostaTrueOrBloccataTrue().forEach(f -> ids.add(f.getGiocatoreId()));

        List<FotoSegnalataDTO> out = new ArrayList<>();
        for (Long id : ids) {
            Giocatore g = giocatoreRepository.findById(id).orElse(null);
            if (g == null) continue;
            GiocatoreFoto f = fotoRepository.findById(id).orElse(null);
            FotoSegnalataDTO dto = new FotoSegnalataDTO();
            dto.setGiocatoreId(id);
            dto.setNickname(g.getNickname());
            dto.setNumSegnalazioni(segnalazioneRepository.countByGiocatoreId(id));
            dto.setNascosta(f != null && f.isNascosta());
            dto.setBloccata(f != null && f.isBloccata());
            dto.setHaFoto(f != null && f.getData() != null);
            out.add(dto);
        }
        out.sort(Comparator.comparingLong(FotoSegnalataDTO::getNumSegnalazioni).reversed());
        return out;
    }

    /** Rimuove la foto di un giocatore e, se richiesto, gli vieta di caricarne altre. Azzera le segnalazioni. */
    @Transactional
    public void adminRimuovi(Long giocatoreId, boolean blocca) {
        Giocatore g = giocatoreRepository.findById(giocatoreId)
                .orElseThrow(() -> new ManagedException("Giocatore non trovato", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA));
        eliminaFoto(g, blocca);
        log.warn("Admin: foto profilo del giocatore {} rimossa (blocco caricamenti: {})", giocatoreId, blocca);
    }

    /** Le segnalazioni erano infondate: la foto torna visibile e le segnalazioni vengono azzerate. */
    @Transactional
    public void adminRipristina(Long giocatoreId) {
        segnalazioneRepository.deleteByGiocatoreId(giocatoreId);
        GiocatoreFoto foto = fotoRepository.findById(giocatoreId).orElse(null);
        if (foto == null) return;
        foto.setNascosta(false);
        fotoRepository.save(foto);
        if (foto.getData() != null) {
            giocatoreRepository.findById(giocatoreId).ifPresent(g -> {
                g.setFotoVersion(versione(foto.getUpdatedAt()));
                giocatoreRepository.save(g);
            });
        }
        log.warn("Admin: foto profilo del giocatore {} ripristinata", giocatoreId);
    }

    /** Toglie il divieto di caricamento. */
    @Transactional
    public void adminSblocca(Long giocatoreId) {
        fotoRepository.findById(giocatoreId).ifPresent(f -> {
            f.setBloccata(false);
            if (f.getData() == null) {
                fotoRepository.delete(f); // niente file e niente blocco: la riga non serve piu'
            } else {
                fotoRepository.save(f);
            }
        });
    }

    /** Pulizia alla cancellazione dell'account (il DB ha anche ON DELETE CASCADE: doppia sicurezza). */
    @Transactional
    public void eliminaTutteLeFotoDi(Long giocatoreId) {
        segnalazioneRepository.deleteByGiocatoreId(giocatoreId);
        segnalazioneRepository.deleteBySegnalatoreId(giocatoreId);
        fotoRepository.findById(giocatoreId).ifPresent(fotoRepository::delete);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private void eliminaFoto(Giocatore giocatore, boolean blocca) {
        segnalazioneRepository.deleteByGiocatoreId(giocatore.getId());
        GiocatoreFoto foto = fotoRepository.findById(giocatore.getId()).orElse(null);
        boolean mantieniBlocco = blocca || (foto != null && foto.isBloccata());
        if (foto != null && !mantieniBlocco) {
            fotoRepository.delete(foto);
        } else if (mantieniBlocco) {
            GiocatoreFoto f = foto != null ? foto : new GiocatoreFoto();
            f.setGiocatoreId(giocatore.getId());
            f.setData(null);
            f.setNascosta(false);
            f.setBloccata(true);
            f.setUpdatedAt(LocalDateTime.now());
            fotoRepository.save(f);
        }
        giocatore.setFotoVersion(null);
        giocatoreRepository.save(giocatore);
    }

    private Giocatore giocatoreCorrente() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) auth.getPrincipal();
        return giocatoreRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Giocatore non trovato per userId: " + userId));
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    private static long versione(LocalDateTime t) {
        return t.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    /**
     * Decodifica l'immagine ricevuta, la ritaglia al quadrato centrale e la ricodifica come JPEG {@link #LATO}x{@link #LATO}.
     * Qualunque file che non sia un'immagine valida di dimensioni ragionevoli viene rifiutato.
     */
    byte[] normalizza(byte[] originale) {
        if (originale == null || originale.length == 0) {
            throw fotoNonValida();
        }
        try (ImageInputStream in = ImageIO.createImageInputStream(new ByteArrayInputStream(originale))) {
            Iterator<ImageReader> readers = ImageIO.getImageReaders(in);
            if (!readers.hasNext()) throw fotoNonValida();
            ImageReader reader = readers.next();
            try {
                reader.setInput(in, true, true);
                int w = reader.getWidth(0);
                int h = reader.getHeight(0);
                if (w < MIN_PIXEL || h < MIN_PIXEL || w > MAX_PIXEL || h > MAX_PIXEL) throw fotoNonValida();
                BufferedImage src = reader.read(0);
                return ricodificaQuadrata(src);
            } finally {
                reader.dispose();
            }
        } catch (ManagedException e) {
            throw e;
        } catch (IOException | RuntimeException e) {
            log.warn("Foto profilo rifiutata: {}", e.getMessage());
            throw fotoNonValida();
        }
    }

    private byte[] ricodificaQuadrata(BufferedImage src) throws IOException {
        int lato = Math.min(src.getWidth(), src.getHeight());
        int sx = (src.getWidth() - lato) / 2;
        int sy = (src.getHeight() - lato) / 2;

        BufferedImage out = new BufferedImage(LATO, LATO, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = out.createGraphics();
        try {
            g.setColor(Color.WHITE); // niente trasparenza: i PNG con alpha finiscono su bianco
            g.fillRect(0, 0, LATO, LATO);
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            g.drawImage(src, 0, 0, LATO, LATO, sx, sy, sx + lato, sy + lato, null);
        } finally {
            g.dispose();
        }

        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(0.85f);
            writer.setOutput(ios);
            writer.write(null, new IIOImage(out, null, null), param);
            ios.flush();
            return baos.toByteArray();
        } finally {
            writer.dispose();
        }
    }

    private static ManagedException fotoNonValida() {
        return new ManagedException("Immagine non valida", ManagedException.InternalCode.FOTO_NON_VALIDA);
    }
}
