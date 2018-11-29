export interface BoxClickRichieste {
    chiamate?: boolean;
    assegnati?: boolean;
    sospesi?: boolean;
    presidiati?: boolean;
}

export interface BoxClickMezzi {
    inSede?: boolean;
    inRientro?: boolean;
    inViaggio?: boolean;
    sulPosto?: boolean;
    istituto?: boolean;
}

export interface BoxClickInterface {
    richieste: BoxClickRichieste;
    mezzi: BoxClickMezzi;
}
