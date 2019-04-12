import { ListaSedi } from '../../../../core/settings/lista-sedi';
import { Ricorsivo } from '../../../interface/treeview.interface';

export function allFalseTreeItem(lista: ListaSedi) {
    const key = 'children';
    Object.assign(lista, { checked: false, collapsed: true });
    if (key in lista) {
        lista[key].forEach(nodes => {
            allFalseTreeItem(nodes);
        });
    }
}

export function findItem(element: ListaSedi, value: string): ListaSedi {
    if (element.value === value) {
        return element;
    } else if (element.children != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < element.children.length; i++) {
            result = findItem(element.children[i], value);
        }
        return result;
    }
    return null;
}

export function checkTreeItem(lista: ListaSedi, checkIds: string[], ricorsivo?: Ricorsivo): number {
    const key = 'children';
    if (ricorsivo === Ricorsivo.Ricorsivo) {
        /**
         * il nodo padre è selezionato e nel ramo corrente sono tutti selezionati
         */
        Object.assign(lista, { checked: true });
        /**
         * se ci sono nodi figli li seleziono ricorsivamente
         */
        if (key in lista) {
            lista[key].forEach(nodes => {
                checkTreeItem(nodes, checkIds, Ricorsivo.Ricorsivo);
            });
        }
        return 1;
    }
    if (checkIds.includes(lista.value)) {
        /**
         * il nodo padre NON è selezionato, ma nel ramo corrente ci sono selezionati
         */
        Object.assign(lista, { checked: true });
        /**
         * se ci sono nodi figli li seleziono ricorsivamente
         */
        if (key in lista) {
            lista[key].forEach(nodes => {
                checkTreeItem(nodes, checkIds, Ricorsivo.Ricorsivo);
            });
        }
        return 1;
    } else {
        Object.assign(lista, { collapsed: false });
    }
    /**
     * non ci sono padri selezionati e nemmeno nel ramo corrente
     */
    if (key in lista) {
        let countChecked = null;
        lista[key].forEach(nodes => {
            if (checkTreeItem(nodes, checkIds, Ricorsivo.NonRicorsivo) !== null) {
                countChecked += 1;
            }
        });
        if (countChecked !== null) {
            if (lista[key].length !== countChecked) {
                Object.assign(lista, { collapsed: false });
            }
        } else if (countChecked === null) {
            Object.assign(lista, { collapsed: true });
        }
        return countChecked;
    }
    return null;
}

export function splitWord(value: string): string[] {
    return value.split(' ');
}

export function lengthString(value: string, count: number): boolean {
    return value.length > count;
}

export function getWord(value: string): string {

    const mapDizionarioSedi = new Map([
        ['comando', 'com.'],
        ['distaccamento', 'dist.'],
        ['direzione', 'dir.'],
        ['regionale', 'reg.'],
        ['cittadino', 'citt.']
    ]);

    const truncate = mapDizionarioSedi.get(value.toLowerCase());

    return truncate ? capitalizeFirstLetter(truncate) : value;

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

export function sedeString(value: string): string {

    const maxLength = 21;
    const stringLength = value.length;

    function truncateWord(_value) {
        let truncateString = '';
        let currentLength = stringLength;
        splitWord(_value).forEach((string, index, array) => {
            const wordTruncate = getWord(string);
            const diffWordLength = string.length - wordTruncate.length;
            currentLength -= diffWordLength;
            if (index === 0 || currentLength >= maxLength) {
                truncateString += wordTruncate;
            } else {
                truncateString += string;
            }
            truncateString += (index - (array.length - 1)) ? ' ' : '';
        });
        return truncateString;
    }

    return lengthString(value, maxLength) ? truncateWord(value) : value;
}
