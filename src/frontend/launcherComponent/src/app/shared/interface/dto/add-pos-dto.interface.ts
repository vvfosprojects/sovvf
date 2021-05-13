import { TipologiaPos } from '../pos.interface';

export interface AddPosDtoInterface {
    descrizionePos: string;
    FDFile: string;
    listaTipologie: TipologiaPos[];
}
