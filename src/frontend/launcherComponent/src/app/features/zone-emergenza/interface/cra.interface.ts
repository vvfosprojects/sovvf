import { Doa } from './doa.interface';
import { Coordinate } from '../../../shared/model/coordinate.model';

export interface Cra {
    id: string;
    nome: string;
    coordinate: Coordinate;
    indirizzo: string;
    listaDoa: Doa[];
    dirigenti: string[];
}

// DIRIGENTI
// [0] Comando, Comandante Regionale di Area Colpita
// [1] Operazioni, Responsabile del Distretto Operativo di Area Colpita
// [2] Pianificazione, Responsabile
// [3] Logistica, Responsabile generale dei campi base e dei mezzi operativi
// [4] Amministrativo- Contabile, Responsabile per la gestione del personale e dei contratti
