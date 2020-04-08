export interface BoxClickRichieste {
    chiamate: boolean;
    assegnati: boolean;
    sospesi: boolean;
    presidiati: boolean;
    chiusi: boolean;
}

export interface BoxClickMezzi {
    inSede: boolean;
    inRientro: boolean;
    inViaggio: boolean;
    sulPosto: boolean;
    istituto: boolean;
}

export interface BoxClickInterface {
    richieste: BoxClickRichieste;
    mezzi: BoxClickMezzi;
}

export interface BoxClickArrayInterface {
    richieste: string[];
    mezzi: string[];
}
