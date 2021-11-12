import { Coordinate } from '../../../shared/model/coordinate.model';

export interface PcaForm {
    codice: string;
    nome: string;
    coordinate: Coordinate;
    indirizzo: string;
}
