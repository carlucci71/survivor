package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;

// Le sigla API coincidono con quelle del DB per le nazionali FIFA
// Squadre dei Mondiali 2026 (48 squadre, 12 gironi A-L)
enum SquadreNazionali_API2 implements IEnumSquadre {

    // Girone A
    MES("MES"),      // Messico
    SAF("SAF"),      // Sudafrica
    COR("COR"),      // Corea del Sud
    UEFAD("UEFAD"),  // Vincitrice Spareggio UEFA D

    // Girone B
    CAN("CAN"),      // Canada
    UEFAA("UEFAA"),  // Vincitrice Spareggio UEFA A
    QAT("QAT"),      // Qatar
    SVI("SVI"),      // Svizzera

    // Girone C
    BRA("BRA"),      // Brasile
    MAR("MAR"),      // Marocco
    SCO("SCO"),      // Scozia
    HAI("HAI"),      // Haiti

    // Girone D
    USA("USA"),      // Stati Uniti
    PAR("PAR"),      // Paraguay
    AUS("AUS"),      // Australia
    UEFAC("UEFAC"),  // Vincitrice Spareggio UEFA C

    // Girone E
    GER("GER"),      // Germania
    CUR("CUR"),      // Curaçao
    CIV("CIV"),      // Costa d'Avorio
    ECU("ECU"),      // Ecuador

    // Girone F
    OLA("OLA"),      // Olanda
    JAP("JAP"),      // Giappone
    UEFAB("UEFAB"),  // Vincitrice Spareggio UEFA B
    TUN("TUN"),      // Tunisia

    // Girone G
    BEL("BEL"),      // Belgio
    EGI("EGI"),      // Egitto
    IRA("IRA"),      // Iran
    NZE("NZE"),      // Nuova Zelanda

    // Girone H
    SPA("SPA"),      // Spagna
    CPV("CPV"),      // Capo Verde
    URU("URU"),      // Uruguay
    SAU("SAU"),      // Arabia Saudita

    // Girone I
    FRA("FRA"),      // Francia
    SEN("SEN"),      // Senegal
    INT2("INT2"),    // Vincitrice Spareggio Intercontinentale 2
    NOR("NOR"),      // Norvegia

    // Girone J
    ARG("ARG"),      // Argentina
    ALG("ALG"),      // Algeria
    AUT("AUT"),      // Austria
    GIO("GIO"),      // Giordania

    // Girone K
    POR("POR"),      // Portogallo
    INT1("INT1"),    // Vincitrice Spareggio Intercontinentale 1
    COL("COL"),      // Colombia
    UZB("UZB"),      // Uzbekistan

    // Girone L
    ING("ING"),      // Inghilterra
    CRO("CRO"),      // Croazia
    GHA("GHA"),      // Ghana
    PAN("PAN");      // Panama

    private final String siglaEsterna;

    SquadreNazionali_API2(String siglaEsterna) {
        this.siglaEsterna = siglaEsterna;
    }

    @Override
    public String getSiglaEsterna() {
        return siglaEsterna;
    }
}
