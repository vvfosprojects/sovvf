import { ComponenteInPartenza } from '../componente-in-partenza/componente-in-partenza.model';
import { Mezzo } from '../mezzo/mezzo.model';

export class MezzoInPartenza {
    public autista: ComponenteInPartenza;
    public componenti: ComponenteInPartenza[] = [];
    constructor(public mezzo: Mezzo) {

    }

    /**
     * Sostituisce l'autista corrente con un nuovo autista. Il vecchio autista resta tra i componenti del mezzo in partenza.
     * @param autista E' il nuovo autista 
     */
    public addAutista(autista: ComponenteInPartenza): void {
        if (this.autista) {
            this.autista.autista = false;
            this.componenti.push(this.autista);
        }
        autista.autista = true;
        this.autista = autista;
    }

    /**
     * Sposta un componente nella lista dei componenti
     * @param oldIndex E' l'indice del componente da spostare
     * @param newIndex E' il nuovo indice acquisito dal componente dopo lo spostamento
     */
    public moveComponente(oldIndex: number, newIndex: number): void {
        var comps = this.componenti.splice(oldIndex, 1);
        this.componenti.splice(newIndex, 0, ...comps);
    }

    public get esisteAutista() {
        return !!this.autista;
    }
}
