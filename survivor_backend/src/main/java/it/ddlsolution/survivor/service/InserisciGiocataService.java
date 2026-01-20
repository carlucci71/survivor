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
        GiocatoreDTO giocatoreDTO = giocataService.inserisciGiocata(request);
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
