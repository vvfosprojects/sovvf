import { DettaglioTipologia } from '../../dettaglio-tipologia.interface';

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

export interface DeleteDettaglioTipologiaDto {
    codDettaglio: number;
}

export interface GetDettaglioTipologiaByCodTipologiaDto {
    listaDettaglioTipologie: DettaglioTipologia[];
}
