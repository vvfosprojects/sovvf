import { Ricorsivo } from '../../../features/navbar/store/states/sedi-treeview/sedi-treeview.helper';

export interface TreeviewEmitterInterface {
    idSelezionati: string[];
    ricorsivo?: Ricorsivo;
}
