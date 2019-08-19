export interface FiltriComposizione extends FiltriComposizioneFilterbar, FiltriComposizioneCodiceMezzo, FiltriComposizioneCodiceSquadra, FiltriComposizioneIdRichiesta {
}

export interface FiltriComposizioneFilterbar {
    CodiceDistaccamento?: string[];
    CodiceStatoMezzo?: string[];
    CodiceTipoMezzo?: string[];
}

export interface FiltriComposizioneIdRichiesta {
    idRichiesta: string;
}

export interface FiltriComposizioneCodiceMezzo {
    CodiceMezzo: string[];
}

export interface FiltriComposizioneCodiceSquadra {
    CodiceSquadra: string[];
}
