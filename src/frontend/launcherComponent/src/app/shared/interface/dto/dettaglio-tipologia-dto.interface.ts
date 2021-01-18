export interface DettaglioTipologiaDto {
    codiceTipologia: number;
    descrizione: string;
}


export interface UpDateDettaglioTipologiaDto {
    codiceTipologia: number;
    descrizione: string;
    codiceDettaglioTipologia:string;
    id:string;
}