package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.SquadreSerieA;

enum SquadreSerieA_API2 implements IEnumSquadre {
        ATA(SquadreSerieA.ATA.name()),
        BOL(SquadreSerieA.BOL.name()),
        CAG(SquadreSerieA.CAG.name()),
        COM(SquadreSerieA.COM.name()),
        CRE(SquadreSerieA.CRE.name()),
        FIO(SquadreSerieA.FIO.name()),
        GEN(SquadreSerieA.GEN.name()),
        INT(SquadreSerieA.INT.name()),
        JUV(SquadreSerieA.JUV.name()),
        LAZ(SquadreSerieA.LAZ.name()),
        LEC(SquadreSerieA.LEC.name()),
        MIL(SquadreSerieA.MIL.name()),
        NAP(SquadreSerieA.NAP.name()),
        PAR(SquadreSerieA.PAR.name()),
        PIS(SquadreSerieA.PIS.name()),
        ROM(SquadreSerieA.ROM.name()),
        SAS(SquadreSerieA.SAS.name()),
        TOR(SquadreSerieA.TOR.name()),
        UDI(SquadreSerieA.UDI.name()),
        VER(SquadreSerieA.VER.name());
        final String sigla;

        SquadreSerieA_API2(String sigla) {
            this.sigla = sigla;
        }

        @Override
        public String getSigla() {
            return sigla;
        }
    }
