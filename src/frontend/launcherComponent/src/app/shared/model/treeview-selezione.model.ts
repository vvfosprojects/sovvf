import { Ricorsivo } from '../interface/treeview.interface';

export class TreeviewSelezione {
    idSede: string;
    ricorsivo: Ricorsivo;

    constructor(idSedeValue: string, ricorsivoValue: Ricorsivo) {
        this.idSede = idSedeValue;
        this.ricorsivo = ricorsivoValue;
    }
}
