import { TipologieInterface } from '../../core/settings/tipologie';
import { ListaSedi } from '../../core/settings/lista-sedi';

export interface AppSettings {
    tipologie: TipologieInterface[];
    listaSedi: ListaSedi;
}
