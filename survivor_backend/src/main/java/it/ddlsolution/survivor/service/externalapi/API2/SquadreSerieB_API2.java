package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.SquadreSerieB;

enum SquadreSerieB_API2 implements IEnumSquadre {
        CTZ("CTZ"),
        BAR("BAR"),
        JST("JST"),
        CES("CES"),
        SPE("SPE"),
        FRO("FRO"),
        VEN("VEN"),
        MOD("MOD"),
        CAR("CAR"),
        MON("MONZ"),
        SAM("SAM"),
        PAD("PAD"),
        PAL("PAL"),
        AVE("AVE"),
        REG("REG"),
        PES("PES"),
        STR("STR"),
        ENT("ENT"),
        EMP("EMP"),
        MAN("MAN");
        final String sigla;

        SquadreSerieB_API2(String sigla) {
            this.sigla = sigla;
        }

        @Override
        public String getSigla() {
            return sigla;
        }
    }
