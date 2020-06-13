import { ListaSedi, ListaSediAPI } from './lista-sedi';
import { Ruolo, Utente } from '../model/utente.model';

export interface AppSettings {
    listaSedi: ListaSedi;
    ruoliUtLoggato: Ruolo[];
    utente: Utente;
}

export interface AppSettingsAPI {
    listaSedi: ListaSediAPI;
    ruoliUtLoggato: Ruolo[];
    utente: Utente;
}
