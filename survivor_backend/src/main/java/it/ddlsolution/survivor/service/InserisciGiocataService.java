package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.request.GiocataRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InserisciGiocataService {

    private final GiocataService giocataService;

    public GiocatoreDTO inserisciGiocata(GiocataRequestDTO request) {
        return inserisci(request, true);
    }

    /**
     * Inserimento eseguito dal sistema durante il calcolo (KO automatico per chi non ha giocato): non
     * deve dipendere dall'utente autenticato, che nello scheduler orario è un utente tecnico senza ruoli.
     */
    public GiocatoreDTO inserisciGiocataDiSistema(GiocataRequestDTO request) {
        return inserisci(request, false);
    }

    private GiocatoreDTO inserisci(GiocataRequestDTO request, boolean controllaAutorizzazione) {
        GiocatoreDTO giocatoreDTO = giocataService.inserisciGiocata(request, controllaAutorizzazione);
        GiocataDTO giocataDTO = giocatoreDTO.getGiocate()
                .stream()
                .filter(g -> g.getGiornata().equals(request.getGiornata()))
                .filter(g -> g.getLegaId().equals(request.getLegaId()))
                .findFirst().get();
        try {
            giocataService.aggiornaSnapshotGiocata(giocataDTO);
        }catch (Exception e){}
        return giocatoreDTO;
    }

}
