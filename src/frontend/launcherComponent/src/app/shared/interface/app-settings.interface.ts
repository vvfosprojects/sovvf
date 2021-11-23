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
    pwESRI: string;
    userESRI: string;
}

export interface AppSettingsAPI {
    listaSedi: ListaSediAPI;
    ruoliUtLoggato: Ruolo[];
    utente: Utente;
    infoNue: ContatoriSchedeContatto;
    centroMappaMarker: CentroMappaNavbar;
    pwESRI: string;
    userESRI: string;
}

export interface CentroMappaNavbar {
    coordinateCentro: string[];
    zoom?: number;
}
