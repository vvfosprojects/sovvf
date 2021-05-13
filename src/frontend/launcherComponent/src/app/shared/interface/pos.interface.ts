export interface PosInterface {
    descrizionePos: string;
    fileName: string;
    filePath: string;
    listaTipologie: TipologiaPos[];
}

export interface TipologiaPos {
    codTipologia: number;
    codTipologiaDettaglio?: number[];
}
