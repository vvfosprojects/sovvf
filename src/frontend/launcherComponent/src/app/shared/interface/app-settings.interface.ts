import { ListaSedi, ListaSediAPI } from './lista-sedi';
import { Ruolo, Utente } from '../model/utente.model';
import { ContatoriSchedeContatto } from './contatori-schede-contatto.interface';
import { CentroMappa } from '../../features/maps/maps-model/centro-mappa.model';

export interface AppSettings {
    listaSedi: ListaSedi;
    ruoliUtLoggato: Ruolo[];
    utente: Utente;
    infoNue: ContatoriSchedeContatto;
    centroMappaMarker: CentroMappa;
    tokenESRI: string;
}

export interface AppSettingsAPI {
    listaSedi: ListaSediAPI;
    ruoliUtLoggato: Ruolo[];
    utente: Utente;
    infoNue: ContatoriSchedeContatto;
    centroMappaMarker: CentroMappa;
    tokenESRI: string;
}
