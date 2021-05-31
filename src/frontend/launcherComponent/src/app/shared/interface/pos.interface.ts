export interface PosInterface {
    id: string;
    descrizionePos: string;
    codSede: string;
    listaTipologie: TipologiaPos[];
}

export interface TipologiaPos {
    codTipologia: number;
    codTipologiaDettaglio?: number[];
}
