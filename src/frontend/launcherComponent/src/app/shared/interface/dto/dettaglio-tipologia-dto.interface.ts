export interface DettaglioTipologiaDto {
    codiceTipologia: number;
    descrizione: string;
}


export interface UpdateDettaglioTipologiaDto {
    id: string;
    codiceTipologia: number;
    descrizione: string;
    codiceDettaglioTipologia: number;
}
