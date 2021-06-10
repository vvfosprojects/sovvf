import { TipologiaPos } from '../../pos.interface';

export interface EditPosDtoInterface {
    descrizionePos: string;
    FDFile: string;
    listaTipologie: TipologiaPos[];
}
