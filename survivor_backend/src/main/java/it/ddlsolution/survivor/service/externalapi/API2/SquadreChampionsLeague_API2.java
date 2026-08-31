package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;

// NEL NAME VA IL NOME DB E IN SIGLAESTERNA QUELLO DELL'API.
// CENSITE LE 36 SQUADRE DELLA FASE A CAMPIONATO 2026/27 (competitionId=5, phase=championship).
// Per i club che giocano anche in un campionato già censito (Serie A, Liga, Premier League) si
// riusa la STESSA sigla interna di quel campionato, così il logo (TeamLogoService) si trova già
// pronto: basta aggiungere una entry "CHAMPIONS_LEAGUE_<sigla>" allo stesso file immagine.
// Solo fase a campionato per ora: fase a eliminazione diretta (andata/ritorno) non ancora gestita.
enum SquadreChampionsLeague_API2 implements IEnumSquadre {
    // Già censiti altrove: stessa sigla interna, riusa il logo esistente
    ARS("ARS"),   // Arsenal (Premier League)
    AST("AST"),   // Aston Villa (Premier League)
    ATM("ATM"),   // Atletico Madrid (Liga)
    BAR("BAR"),   // Barcellona (Liga)
    BET("BET"),   // Real Betis (Liga)
    VIL("VIL"),   // Villarreal (Liga)
    RMA("RMA"),   // Real Madrid (Liga)
    INT("INT"),   // Inter (Serie A)
    NAP("NAP"),   // Napoli (Serie A)
    ROM("ROM"),   // Roma (Serie A)
    COM("COM"),   // Como (Serie A)
    LIV("LIV"),   // Liverpool (Premier League)
    MNC("MNC"),   // Manchester City (Premier League)
    MNU("MNU"),   // Manchester United (Premier League)

    // Nuovi per la Champions League: nessun logo ancora presente, serve aggiungerlo
    AEK("AEK"),   // AEK Atene
    BMU("BMU"),   // Bayern Monaco
    BOD("BOD"),   // Bodo/Glimt
    BDO("BDO"),   // Borussia Dortmund
    BRU("BRU"),   // Bruges
    FEN("FEN"),   // Fenerbahce
    FEY("FEY"),   // Feyenoord
    GAL("GAL"),   // Galatasaray
    LIZ("LIZ"),   // LASK (sigla Gazzetta: LIZ)
    LEN("LEN"),   // Lens
    LIL("LIL"),   // Lille
    LEI("LEI"),   // Lipsia (RB Leipzig)
    PSG("PSG"),   // Paris Saint-Germain
    PTO("PTO"),   // Porto
    PSV("PSV"),   // PSV Eindhoven
    SAB("SAB"),   // Sabah
    SDK("SDK"),   // Shakhtar Donetsk
    SLP("SLP"),   // Slavia Praga
    BRT("BRT"),   // Slovan Bratislava
    SCP("SCP"),   // Sporting Lisbona
    STO("STO"),   // Stoccarda (VfB Stuttgart)
    VIS("VIS");   // Viking

    final String siglaEsterna;

    SquadreChampionsLeague_API2(String siglaEsterna) {
        this.siglaEsterna = siglaEsterna;
    }

    @Override
    public String getSiglaEsterna() {
        return siglaEsterna;
    }
}
