import { TipologieInterface } from './tipologie';
import { ListaSedi } from './lista-sedi';

export interface AppSettingsI {
    tipologie: TipologieInterface[];
    listaSedi: ListaSedi;
}
