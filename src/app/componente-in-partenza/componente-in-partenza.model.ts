import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';

export class ComponenteInPartenza {
    public capoPartenza: boolean = false;
    public autista: boolean = false;

    /**
     * Crea un nuovo componente in partenza dal ComponenteSquadra indicato.
     * Il componente in partenza viene impostato come inPartenza.
     * @param componente Il componente che prende parte alla partenza
     */
    constructor(public componente: ComponenteSquadra) {
        componente.inPartenza = true;
    }
}
