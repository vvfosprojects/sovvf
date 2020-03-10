import { ListaSedi, ListaSediAPI } from './lista-sedi';
import { Ruolo } from '../model/utente.model';

export interface AppSettings {
    listaSedi: ListaSedi;
    listaRuoli: Ruolo[];
}

export interface AppSettingsAPI {
    listaSedi: ListaSediAPI;
}
