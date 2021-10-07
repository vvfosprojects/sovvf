import { ListaSedi } from '../interface/lista-sedi';
import { Ruolo } from '../model/utente.model';
import { findItem } from '../store/states/sedi-treeview/sedi-treeview.helper';

export function getRuoliRicorsivo(ruoloRicorsivo: Ruolo, listaSedi: ListaSedi): Ruolo[] {
    const ruoliNonRicorsivi: Ruolo[] = [];
    const sediFiglie: ListaSedi = findItem(listaSedi, ruoloRicorsivo.codSede);
    if (sediFiglie) {
        const flattenedCollection = {};
        if (sediFiglie.children && sediFiglie.children.length > 0) {
            treeToList(sediFiglie, flattenedCollection);
        }
        for (const prop in flattenedCollection) {
            if (flattenedCollection.hasOwnProperty(prop)) {
                ruoliNonRicorsivi.push({
                    descrizione: ruoloRicorsivo.descrizione,
                    codSede: prop,
                    descSede: flattenedCollection[prop].text,
                    ricorsivo: false,
                    hidden: true
                });
            }
        }
    }
    return [ ...ruoliNonRicorsivi, ruoloRicorsivo ];
}

function treeToList(tree, collection): any {
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
