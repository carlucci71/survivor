package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.SquadreNBA;

public enum SquadreNBA_API2 implements IEnumSquadre {
        DET(SquadreNBA.DEN.name()),
        NYK(SquadreNBA.NYK.name()),
        TOR(SquadreNBA.TOR.name()),
        BOS(SquadreNBA.BOS.name()),
        PHI(SquadreNBA.PHI.name()),
        ORL(SquadreNBA.ORL.name()),
        MIA(SquadreNBA.MIA.name()),
        CLE(SquadreNBA.CLE.name()),
        ATL(SquadreNBA.ATL.name()),
        CHI(SquadreNBA.CHI.name()),
        MIL(SquadreNBA.MIL.name()),
        CHA(SquadreNBA.CHA.name()),
        BKN(SquadreNBA.BKN.name()),
        IND(SquadreNBA.IND.name()),
        WAS(SquadreNBA.WAS.name()),
        OKC(SquadreNBA.OKC.name()),
        DEN(SquadreNBA.DEN.name()),
        SAS(SquadreNBA.SAS.name()),
        LAL(SquadreNBA.LAL.name()),
        HOU(SquadreNBA.HOU.name()),
        MIN(SquadreNBA.MIN.name()),
        PHX(SquadreNBA.PHX.name()),
        MEM(SquadreNBA.MEM.name()),
        GSW(SquadreNBA.GSW.name()),
        POR(SquadreNBA.POR.name()),
        DAL(SquadreNBA.DAL.name()),
        UTA(SquadreNBA.UTA.name()),
        LAC(SquadreNBA.LAC.name()),
        SAC(SquadreNBA.SAC.name()),
        NOP(SquadreNBA.NOP.name());
        final String sigla;

        SquadreNBA_API2(String sigla) {
            this.sigla = sigla;
        }

        @Override
        public String getSigla() {
            return sigla;
        }
    }
