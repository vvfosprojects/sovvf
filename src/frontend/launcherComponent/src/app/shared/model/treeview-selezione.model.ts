import { Ricorsivo } from '../interface/treeview.interface';

export class TreeviewSelezione {
    idSede: string;
    ricorsivo: Ricorsivo;

    constructor(_idSede: string, _ricorsivo: Ricorsivo) {
        this.idSede = _idSede;
        this.ricorsivo = _ricorsivo;
    }
}
