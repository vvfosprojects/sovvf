import { ListaSedi } from './lista-sedi';
import { Tipologia } from '../model/tipologia.model';

export interface AppSettings {
    tipologie: Tipologia[];
    listaSedi: ListaSedi;
}
