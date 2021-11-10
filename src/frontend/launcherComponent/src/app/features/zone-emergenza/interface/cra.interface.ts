import { Doa } from './doa.interface';
import { Coordinate } from '../../../shared/model/coordinate.model';

export interface Cra {
    codice: string;
    nome: string;
    coordinate: Coordinate;
    indirizzo: string;
    dirigenti: string[];
    listaDoa: Doa[];
}

// DIRIGENTI
// Comando, Comandante Regionale di Area Colpita
// Operazioni, Responsabile del Distretto Operativo di Area Colpita
// Pianificazione, Responsabile
// Logistica, Responsabile generale dei campi base e dei mezzi operativi
// Amministrativo- Contabile, Responsabile per la gestione del personale e dei contratti
