export interface PosInterface {
    id: string;
    descrizionePos: string;
    codSede: string;
    fileName: string;
    listaTipologie: TipologiaPos[];
    FDFile: any;
}

export interface TipologiaPos {
    codTipologia: number;
    codTipologiaDettaglio?: number[];
}
