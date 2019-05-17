import { TipologieInterface } from './tipologie';
import { ListaSedi } from './lista-sedi';

export interface AppSettings {
    tipologie: TipologieInterface[];
    listaSedi: ListaSedi;
}
