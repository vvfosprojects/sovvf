import { ListaSedi, ListaSediAPI } from './lista-sedi';
import { Tipologia } from '../model/tipologia.model';

export interface AppSettings {
    tipologie: Tipologia[];
    listaSedi: ListaSedi;
}

export interface AppSettingsAPI {
    tipologie: Tipologia[];
    listaSedi: ListaSediAPI;
}
