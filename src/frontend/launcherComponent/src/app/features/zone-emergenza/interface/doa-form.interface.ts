import { Coordinate } from '../../../shared/model/coordinate.model';
import { Doa } from './doa.interface';
import { ModuloColonnaMobile } from './modulo-colonna-mobile.interface';
import { Pca } from './pca.interface';

export interface DoaForm {
    codice?: string;
    nome: string;
    coordinate: Coordinate;
    indirizzo: string;
    dirigente: string;
    listaModuliColonnaMobile: ModuloColonnaMobile[];
    listaComuniInteressati: string[];
    listaPca?: Pca[];
}
