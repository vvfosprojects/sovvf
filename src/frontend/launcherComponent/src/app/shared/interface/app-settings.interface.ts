import { ListaSedi, ListaSediAPI } from './lista-sedi';
import { Ruolo, Utente } from '../model/utente.model';
import { ContatoriSchedeContatto } from './contatori-schede-contatto.interface';

export interface AppSettings {
    listaSedi: ListaSedi;
    ruoliUtLoggato: Ruolo[];
    utente: Utente;
    infoNue: ContatoriSchedeContatto;
}

export interface AppSettingsAPI {
    listaSedi: ListaSediAPI;
    ruoliUtLoggato: Ruolo[];
    utente: Utente;
    infoNue: ContatoriSchedeContatto;
}
