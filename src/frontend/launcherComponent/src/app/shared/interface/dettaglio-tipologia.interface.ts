import { PosInterface } from './pos.interface';

export interface DettaglioTipologia {
    id: string;
    codSede: string;
    codiceTipologia: number;
    codiceDettaglioTipologia: number;
    descrizione: string;
    pos: PosInterface;
}
