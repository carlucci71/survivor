package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.util.Enumeratori;

public class EnumAPI2 {

    enum Campionato {
        SERIE_A(21, SquadreSerieA.values()),
        SERIE_B(105,SquadreSerieB.values()),
        LIGA(23,SquadreLiga.values()),
        TENNIS_W(11316,SquadreTennis.values()),
        TENNIS_AO(12389,SquadreTennis.values()),
        NBA_RS(3,SquadreNBA.values());

        int id;
        IEnumSquadre[] squadre;

        Campionato(int id, IEnumSquadre[] squadre) {
            this.id = id;
            this.squadre=squadre;
        }

        static Campionato fromId(int id) {
            Campionato ret = null;
            for (Campionato campionato : values()) {
                if (campionato.id == id) {
                    ret = campionato;
                }
            }
            return ret;
        }
    }

    interface IEnumSquadre {
        String getSigla();
        String name();
    }

    private enum SquadreSerieA implements IEnumSquadre {
        ATA("ATA"),
        BOL("BOL"),
        CAG("CAG"),
        COM("COM"),
        CRE("CRE"),
        FIO("FIO"),
        GEN("GEN"),
        INT("INT"),
        JUV("JUV"),
        LAZ("LAZ"),
        LEC("LEC"),
        MIL("MIL"),
        NAP("NAP"),
        PAR("PAR"),
        PIS("PIS"),
        ROM("ROM"),
        SAS("SAS"),
        TOR("TOR"),
        UDI("UDI"),
        VER("VER");
        String sigla;
        SquadreSerieA(String sigla) {
            this.sigla = sigla;
        }
        @Override
        public String getSigla(){
            return sigla;
        }
    }

    private enum SquadreSerieB implements IEnumSquadre {
        CTZ("CTZ"),
        BAR("BAR"),
        JST("JST"),
        CES("CES"),
        SPE("SPE"),
        FRO("FRO"),
        VEN("VEN"),
        MOD("MOD"),
        CAR("CAR"),
        MONZ("MONZ"),
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
        String sigla;
        SquadreSerieB(String sigla) {
            this.sigla = sigla;
        }
        @Override
        public String getSigla(){
            return sigla;
        }
    }

    private enum SquadreLiga implements IEnumSquadre {
        RAY("RAY"),
        GIR("GIR"),
        OVI("OVI"),
        VIL("VIL"),
        BAR("BAR"),
        MLL("MLL"),
        LEV("LEV"),
        ALA("ALA"),
        RSO("RSO"),
        VAL("VAL"),
        GET("GET"),
        VIG("VIG"),
        SEV("SEV"),
        ATH("ATH"),
        ATM("ATM"),
        ESP("ESP"),
        BET("BET"),
        ELC("ELC"),
        OSA("OSA"),
        RMA("RMA");
        String sigla;
        SquadreLiga(String sigla) {
            this.sigla = sigla;
        }
        @Override
        public String getSigla(){
            return sigla;
        }
    }

    private enum SquadreTennis implements IEnumSquadre {
        JANNIK_SINNER("33848"),
        MATEJ_DODIG("36699"),
        BENJAMIN_HASSAN("33150"),
        LUKA_MIKRUT("34580"),
        JOAO_LUCAS_REIS_DA_SILVA("32318"),
        HENRIQUE_ROCHA("34588"),
        PHILIP_SEKULIC("35060"),
        MARCO_TRUNGELLITI("24583"),
        ROMAN_ANDRES_BURRUCHAGA("34314"),
        RYAN_PENISTON("34187"),
        ZDENEK_KOLAR("31001"),
        ARTHUR_GEA("35215"),
        LLOYD_HARRIS("32270"),
        FEDERICO_CINA("36855"),
        RODRIGO_PACHECO_MENDEZ("35117"),
        ADOLFO_DANIEL_VALLEJO("35414"),
        GONZALO_BUENO("34891"),
        PIERRE_HUGUES_HERBERT("10042"),
        GUY_DEN_OUDEN("34712"),
        PAVLE_MARINKOV("36651"),
        YOSUKE_WATANUKI("32427"),
        NICOLAI_BUDKOV_KJAER("36669"),
        TOMAS_BARRIOS_VERA("32362"),
        SASCHA_GUEYMARD_WAYENBURG("34667"),
        CRUZ_HEWITT("37194"),
        MICHAEL_ZHENG("36383"),
        OLIVER_CRAWFORD("33873"),
        DANIEL_MERIDA_AGUILAR("34890"),
        ZSOMBOR_PIROS("33172"),
        BRANDON_HOLT("33352"),
        LUKAS_NEUMAYER("34685"),
        GIULIO_ZEPPIERI("34115"),
        DAN_ADDED("33712"),
        REI_SAKAMOTO("36685"),
        DANIEL_EVANS("7054"),
        LUKA_PAVLOVIC("36957"),
        COLTON_SMITH("37076"),
        MACKENZIE_MCDONALD("15366"),
        DMITRY_POPKO("29393"),
        DANIEL_ELAHI_GALAN("29519"),
        HUGO_GRENIER("31487"),
        VITALIY_SACHKO("30029"),
        VIKTOR_DURASOVIC("32077"),
        MOERANI_BOUZIGE("34026"),
        LIAM_DRAXL("33886"),
        ALEXANDER_BLOCKX("36002"),
        MARCO_CECCHINATO("4149"),
        SHO_SHIMABUKURO("31995"),
        ALEX_MOLCAN("31789"),
        JASON_KUBLER("12831"),
        HAROLD_MAYOT("34312"),
        NICOLAS_MORENO_DE_ALBORAN("34243"),
        VILIUS_GAUBAS("35996"),
        NERMAN_FATIC("29151"),
        JUSTIN_ENGEL("35982"),
        GEORGE_LOFFHAGEN("33834"),
        ALEXIS_GALARNEAU("32007"),
        AUGUST_HOLMGREN("34887"),
        SEBASTIAN_OFNER("32806"),
        ELMER_MOLLER("36248"),
        MARC_POLMANS("30699"),
        ALEX_BOLT("2791"),
        ELIAS_YMER("29607"),
        PABLO_LLAMAS_RUIZ("34297"),
        HENRY_BERNET("37049"),
        CHAK_LAM_COLEMAN_WONG("35415"),
        UGO_BLANCHET("33826"),
        BLAKE_ELLIS("32369"),
        STEFANO_TRAVAGLIA("24499"),
        JEROME_KYM("34104"),
        JUAN_CARLOS_PRADO_ANGELO("35093"),
        DANE_SWEENY("34339"),
        ANDREA_PELLEGRINO("32425"),
        JAN_CHOINSKI("31209"),
        LEANDRO_RIEDI("34456"),
        KIMMER_COPPEJANS("29287"),
        JUAN_PABLO_FICOVICH("31699"),
        JURIJ_RODIONOV("32996"),
        ZACHARY_SVAJDA("34278"),
        NICOLAS_MEJIA("32634"),
        YIBING_WU("32602"),
        ALEX_BARRENA("35275"),
        MARK_LAJAL("35458"),
        MURPHY_CASSONE("35151"),
        YU_HSIOU_HSU("32897"),
        ALVARO_GUILLEN_MEZA("33530"),
        LORENZO_GIUSTINO("8628"),
        FRANCESCO_MAESTRELLI("34405"),
        DINO_PRIZMIC("35152"),
        GENARO_ALBERTO_OLIVIERI("32960"),
        GUSTAVO_HEIDE("34996"),
        JAY_CLARKE("30044"),
        ARTHUR_FERY("34652"),
        EDWARD_WINTER("34383"),
        BERNARD_TOMIC("24325"),
        HUGO_DELLIEN("5850"),
        BILLY_HARRIS("33807"),
        CHRIS_RODESCH("34966"),
        RAFAEL_JODAR("36311"),
        DANIIL_GLINKA("34563"),
        CLEMENT_TABUR("33538"),
        LUCA_VAN_ASSCHE("34528"),
        MOEZ_ECHARGUI("4319"),
        ARTHUR_BOUQUIER("34773"),
        JACK_PINNINGTON_JONES("34496"),
        GILLES_ARNAUD_BAILLY("36001"),
        MARTIN_DAMM("34282"),
        TITOUAN_DROGUET("34531"),
        ALEKSANDAR_KOVACEVIC("33026"),
        THIAGO_AGUSTIN_TIRANTE("33209"),
        FILIP_MISOLIC("34831"),
        MARTON_FUCSOVICS("7862"),
        PATRICK_KYPSON("33245"),
        HAMAD_MEDJEDOVIC("34609"),
        EMILIO_NAVA("33997"),
        KYRIAN_JACQUET("34388"),
        JESPER_DE_JONG("33888"),
        JUAN_MANUEL_CERUNDOLO("33212"),
        RAPHAEL_COLLIGNON("35158"),
        CARLOS_TABERNER("32387"),
        SHINTARO_MOCHIZUKI("34412"),
        LASLO_DJERE("30338"),
        VIT_KOPRIVA("32104"),
        VALENTIN_ROYER("34316"),
        ETHAN_QUINN("35403"),
        TERENCE_ATMANE("35159"),
        VALENTIN_VACHEROT("32247"),
        MARIN_CILIC("4635"),
        DALIBOR_SVRCINA("34160"),
        MATTIA_BELLUCCI("34954"),
        ELIOT_SPIZZIRRI("34806"),
        NICOLAS_JARRY("29837"),
        TRISTAN_SCHOOLKATE("34338"),
        TARO_DANIEL("5455"),
        MARCOS_GIRON("8607"),
        YANNICK_HANFMANN("9680"),
        TOMAS_MARTIN_ETCHEVERRY("34035"),
        FLAVIO_COBOLLI("34169"),
        HUBERT_HURKACZ("29376"),
        TALLON_GRIEKSPOOR("31966"),
        MIOMIR_KECMANOVIC("33224"),
        DUSAN_LAJOVIC("13121"),
        MATTEO_BERRETTINI("31813"),
        CAMERON_NORRIE("29786"),
        ZHIZHEN_ZHANG("29594"),
        HOLGER_RUNE("34196"),
        STEFANOS_TSITSIPAS("31957"),
        ALEX_MICHELSEN("35417"),
        JAMES_MCCABE("35051"),
        MARTIN_LANDALUCE("35967"),
        GABRIEL_DIALLO("34210"),
        LUCA_NARDI("34403"),
        ADRIAN_MANNARINO("14688"),
        KAREN_KHACHANOV("30390"),
        FRANCISCO_CERUNDOLO("32953"),
        ALEXANDER_BUBLIK("31683"),
        FACUNDO_DIAZ_ACOSTA("34056"),
        ZIZOU_BERGS("32314"),
        FEDERICO_CORIA("4976"),
        TRISTAN_BOYER("33698"),
        BOTIC_VAN_DE_ZANDSCHULP("32176"),
        ALEX_DE_MINAUR("32547"),
        TAYLOR_FRITZ("31441"),
        JENSON_BROOKSBY("32934"),
        BORNA_CORIC("28204"),
        CRISTIAN_GARIN("29149"),
        FRANCISCO_COMESANA("34929"),
        DANIEL_ALTMAIER("30260"),
        GAEL_MONFILS("16145"),
        GIOVANNI_MPETSHI_PERRICARD("34455"),
        BEN_SHELTON("34742"),
        BRANDON_NAKASHIMA("32964"),
        PABLO_CARRENO_BUSTA("3925"),
        KAMIL_MAJCHRZAK("30171"),
        ROBERTO_BAUTISTA_AGUT("1969"),
        DENIS_SHAPOVALOV("32179"),
        MATTEO_ARNALDI("34141"),
        LORENZO_MUSETTI("34114"),
        ANDREY_RUBLEV("30452"),
        JOAO_FONSECA("35033"),
        LORENZO_SONEGO("31557"),
        STAN_WAWRINKA("25912"),
        THIAGO_SEYBOTH_WILD("32064"),
        FABIAN_MAROZSAN("33166"),
        ARTHUR_RINDERKNECH("27879"),
        FRANCES_TIAFOE("31333"),
        ALEXEI_POPYRIN("32548"),
        CORENTIN_MOUTET("31583"),
        RINKY_HIJIKATA("33142"),
        MITCHELL_KRUEGER("12795"),
        CAMILO_UGO_CARABELLI("32966"),
        LEARNER_TIEN("35209"),
        KASIDIT_SAMREJ("33588"),
        DANIIL_MEDVEDEV("30453"),
        NOVAK_DJOKOVIC("6194"),
        NISHESH_BASAVAREDDY("35349"),
        PAVEL_KOTOV("33593"),
        JAIME_FARIA("34597"),
        REILLY_OPELKA("31621"),
        GAUTHIER_ONCLIN("32929"),
        SUMIT_NAGAL("30678"),
        TOMAS_MACHAC("34159"),
        JIRI_LEHECKA("33284"),
        LI_TU("30726"),
        HUGO_GASTON("33666"),
        OMAR_JASIKA("29831"),
        DAVID_GOFFIN("8691"),
        BENJAMIN_BONZI("30039"),
        FRANCESCO_PASSARO("33337"),
        GRIGOR_DIMITROV("6137"),
        JACK_DRAPER("33804"),
        MARIANO_NAVONE("34930"),
        THANASI_KOKKINAKIS("28054"),
        ROMAN_SAFIULLIN("31889"),
        DAMIR_DZUMHUR("6582"),
        ALEKSANDAR_VUKIC("29857"),
        SEBASTIAN_KORDA("33247"),
        LUKAS_KLEIN("32415"),
        JORDAN_THOMPSON("29788"),
        DOMINIK_KOEPFER("27932"),
        ALEXANDRE_MULLER("32251"),
        NUNO_BORGES("33981"),
        YOSHIHITO_NISHIOKA("29147"),
        AZIZ_DOUGAZ("30502"),
        ALEXANDER_SHEVCHENKO("34744"),
        CARLOS_ALCARAZ("34132"),
        CASPER_RUUD("32607"),
        JAUME_MUNAR("32038"),
        JAKUB_MENSIK("34661"),
        NIKOLOZ_BASILASHVILI("1885"),
        JUNCHENG_SHANG("34585"),
        ALEJANDRO_DAVIDOVICH_FOKINA("33251"),
        JANLENNARD_STRUFF("23433"),
        FELIX_AUGERALIASSIME("32005"),
        ALEJANDRO_TABILO("32740"),
        ROBERTO_CARBALLES_BAENA("3824"),
        JAMES_DUCKWORTH("6452"),
        DOMINIC_STRICKER("34551"),
        KEI_NISHIKORI("17205"),
        THIAGO_MONTEIRO("16186"),
        CHRISTOPHER_OCONNELL("29084"),
        TOMMY_PAUL("31625"),
        UGO_HUMBERT("32587"),
        MATTEO_GIGANTE("34407"),
        YUNCHAOKETE_BU("35270"),
        HADY_HABIB("33567"),
        ADAM_WALTON("32542"),
        QUENTIN_HALYS("29844"),
        OTTO_VIRTANEN("33901"),
        ARTHUR_FILS("34645"),
        SEBASTIAN_BAEZ("33499"),
        ARTHUR_CAZAUX("34404"),
        JACOB_FEARNLEY("33761"),
        NICK_KYRGIOS("29072"),
        PEDRO_MARTINEZ_PORTERO("32372"),
        LUCIANO_DARDERI("34453"),
        LUCAS_POUILLE("19248"),
        CHUNHSIN_TSENG ("33477"),
        OLIVER_TARVET ("36743"),
        FABIO_FOGNINI ("7619"),
        HENRY_SEARLE ("36131"),
        CHRISTOPHER_EUBANKS ("29370"),
        JOHANNUS_MONDAY ("34983"),
        BEIBIT_ZHUKAYEV ("33065"),
        ALEXANDER_ZVEREV("28728");
        String sigla;
        SquadreTennis(String sigla) {
            this.sigla = sigla;
        }
        @Override
        public String getSigla(){
            return sigla;
        }
    }

    private enum SquadreNBA implements IEnumSquadre {
        DET("DET"),
        NYK("NYK"),
        TOR("TOR"),
        BOS("BOS"),
        PHI("PHI"),
        ORL("ORL"),
        MIA("MIA"),
        CLE("CLE"),
        ATL("ATL"),
        CHI("CHI"),
        MIL("MIL"),
        CHA("CHA"),
        BKN("BKN"),
        IND("IND"),
        WAS("WAS"),
        OKC("OKC"),
        DEN("DEN"),
        SAS("SAS"),
        LAL("LAL"),
        HOU("HOU"),
        MIN("MIN"),
        PHX("PHX"),
        MEM("MEM"),
        GSW("GSW"),
        POR("POR"),
        DAL("DAL"),
        UTA("UTA"),
        LAC("LAC"),
        SAC("SAC"),
        NOP("NOP");
        String sigla;
        SquadreNBA(String sigla) {
            this.sigla = sigla;
        }
        @Override
        public String getSigla(){
            return sigla;
        }
    }


    public enum Sport {
        CALCIO(1),
        BASKET(3),
        TENNIS(8);
        int id;

        Sport(int id) {
            this.id = id;
        }

        static Sport fromId(int id) {
            Sport ret = null;
            for (Sport sport : values()) {
                if (sport.id == id) {
                    ret = sport;
                }
            }
            return ret;
        }
    }

    enum StatoPartitaAP2 {
        PreMatch(Enumeratori.StatoPartita.DA_GIOCARE),
        NOTSTARTED(Enumeratori.StatoPartita.DA_GIOCARE),
        Postponed(Enumeratori.StatoPartita.DA_GIOCARE),
        POSTPONED(Enumeratori.StatoPartita.DA_GIOCARE),
        Cancelled(Enumeratori.StatoPartita.DA_GIOCARE),
        Walkover(Enumeratori.StatoPartita.TERMINATA),
        FirstHalf(Enumeratori.StatoPartita.IN_CORSO),
        HalfTime(Enumeratori.StatoPartita.IN_CORSO),
        SecondHalf(Enumeratori.StatoPartita.IN_CORSO),
        FullTime(Enumeratori.StatoPartita.TERMINATA),
        PLAYED(Enumeratori.StatoPartita.TERMINATA),
        FINISHED(Enumeratori.StatoPartita.TERMINATA),
        INPLAY(Enumeratori.StatoPartita.IN_CORSO),
        RETIRED(Enumeratori.StatoPartita.TERMINATA),
        FIXTURE(Enumeratori.StatoPartita.DA_GIOCARE),
        PLAYING(Enumeratori.StatoPartita.DA_GIOCARE),
        SUSPENDED(Enumeratori.StatoPartita.DA_GIOCARE);


        Enumeratori.StatoPartita statoPartita;

        StatoPartitaAP2(Enumeratori.StatoPartita statoPartita) {
            this.statoPartita = statoPartita;
        }
    }

    enum RoundTennis {
        //        FirstRoundQualifizioni("qualifying-1st-round"),
//        SecondRoundQualifizioni("qualifying-2nd-round"),
//        FinaleQualificazioni("qualifying-final"),
        Sessantaquattresimi("1-128-final", "64-esimi"),
        Trentaduesimi("1-64-final", "32-esimi"),
        Sedicesimi("1-32-final", "16-esimi"),
        Ottavi("1-16-final", "Ottavi"),
        Quarti("quarter-finals", "Quarti"),
        Semifinali("semi-finals", "Semifinali"),
        Finale("final", "Finale");

        String key;
        String descrizione;

        RoundTennis(String key, String descrizione) {
            this.key = key;
            this.descrizione = descrizione;
        }

        static RoundTennis fromkey(String des) {
            RoundTennis ret = null;
            for (RoundTennis round : values()) {
                if (round.key == des) {
                    ret = round;
                }
            }
            return ret;
        }
    }

}
