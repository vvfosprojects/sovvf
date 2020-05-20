import { ListaSedi } from '../interface/lista-sedi';
import { Ruolo } from '../model/utente.model';
import { findItem } from '../store/states/sedi-treeview/sedi-treeview.helper';

export function getRuoliRicorsivo(ruoloRicorsivo: Ruolo, listaSedi: ListaSedi): Ruolo[] {
    const ruoliNonRicorsivi: Ruolo[] = [];
    const codSedeRicorsivi: string[] = [];
    const sediFiglie: ListaSedi = findItem(listaSedi, ruoloRicorsivo.codSede);
    if (sediFiglie) {
        const flattenedCollection = {};
        if (sediFiglie.children && sediFiglie.children.length > 0) {
            treeToList(sediFiglie, flattenedCollection);
            codSedeRicorsivi.push(...Object.keys(flattenedCollection));
        }
        codSedeRicorsivi.forEach(codSede => {
            ruoliNonRicorsivi.push({
                descrizione: ruoloRicorsivo.descrizione,
                codSede,
                descSede: flattenedCollection[codSede].text,
                ricorsivo: false
            });
        });
    }
    return [ ...ruoliNonRicorsivi, ruoloRicorsivo ];
}

function treeToList(tree, collection) {
    if (!tree.children || tree.children.length === 0) {
        return;
    }
    for (let i = 0; i < tree.children.length; i++) {
        const child = tree.children[i];
        collection[child.value] = child;
        treeToList(child, collection);
    }
    return;
}
