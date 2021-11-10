import { Coordinate } from '../../../shared/model/coordinate.model';
import { Pca } from './pca.interface';
import { ModuloColonnaMobile } from './modulo-colonna-mobile.interface';

export interface Doa {
    codice: string;
    nome: string;
    coordinate: Coordinate;
    indirizzo: string;
    dirigente: string;
    listaModuliColonnaMobile: ModuloColonnaMobile[];
    listaPca: Pca[];
}
