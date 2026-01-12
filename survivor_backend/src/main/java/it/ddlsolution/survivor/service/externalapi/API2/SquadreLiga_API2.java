package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.SquadreLiga;

enum SquadreLiga_API2 implements IEnumSquadre {
        RAY(SquadreLiga.RAY.name()),
        GIR(SquadreLiga.GIR.name()),
        OVI(SquadreLiga.OVI.name()),
        VIL(SquadreLiga.VIL.name()),
        BAR(SquadreLiga.BAR.name()),
        MLL(SquadreLiga.MLL.name()),
        LEV(SquadreLiga.LEV.name()),
        ALA(SquadreLiga.ALA.name()),
        RSO(SquadreLiga.RSO.name()),
        VAL(SquadreLiga.VAL.name()),
        GET(SquadreLiga.GET.name()),
        VIG(SquadreLiga.VIG.name()),
        SEV(SquadreLiga.SEV.name()),
        ATH(SquadreLiga.ATH.name()),
        ATM(SquadreLiga.ATM.name()),
        ESP(SquadreLiga.ESP.name()),
        BET(SquadreLiga.BET.name()),
        ELC(SquadreLiga.ELC.name()),
        OSA(SquadreLiga.OSA.name()),
        RMA(SquadreLiga.RMA.name());
        final String sigla;

        SquadreLiga_API2(String sigla) {
            this.sigla = sigla;
        }

        @Override
        public String getSigla() {
            return sigla;
        }
    }

