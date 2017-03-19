import { ComponenteInPartenza } from '../componente-in-partenza/componente-in-partenza.model';
import { Squadra } from '../squadra/squadra.model';
import { Mezzo } from '../mezzo/mezzo.model';
import { CompositoreService } from '../compositore/compositore.service';

export class MezzoInPartenza {
    public autista: ComponenteInPartenza;
    public componenti: ComponenteInPartenza[] = [];
    constructor(public mezzo: Mezzo,
        private compositoreService: CompositoreService) { }

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

    /**
     * Indica se esiste un autista
     */
    public get esisteAutista() {
        return !!this.autista;
    }

    /**
     * Aggiunge una squadra al mezzo. Imposta tutti i componenti inPartenza. Se non c'è un autista,
     * questo viene impostato al primo autista disponibile nella squadra. Se non c'è un capopartenza,
     * questo viene impostato al primo capopartenza disponibile nella squadra.
     * @param squadra La squadra da aggiungere
     */
    public addSquadra(squadra: Squadra): void {
        var componentiInPartenza = squadra.componenti
            .filter(c => !c.inPartenza)
            .map(c => new ComponenteInPartenza(c));

        //aggiunta dell'autista se non già esistente
        if (!this.esisteAutista) {
            var primoAutista = componentiInPartenza.find(c => c.componente.autista);
            if (primoAutista !== undefined) {
                componentiInPartenza = componentiInPartenza.filter(c => c !== primoAutista);
                this.addAutista(primoAutista);
            }
        }

        //accodamento dei nuovi componenti ai vecchi
        this.componenti = [...this.componenti, ...componentiInPartenza];

        //impostazione del capopartenza se non già esistente
        if (this.componenti.find(c => c.capoPartenza) === undefined) {
            var primoCapopartenza = this.componenti.find(c => c.componente.capoPartenza);
            if (primoCapopartenza !== undefined)
                primoCapopartenza.capoPartenza = true;
        }
    }

    /**
     * Svuota il mezzo rimuovendo tutti i componenti. Questi vengono impostati come non inPartenza.
     */
    public svuota(): void {
        this.componenti.forEach(c => c.componente.inPartenza = false);
        this.componenti = [];
    }

    /**
     * Rimuove un componente dal mezzo e lo imposta come non inPartenza.
     * @param componente Il componente da rimuovere.
     */
    public removeComponente(componente: ComponenteInPartenza): void {
        componente.componente.inPartenza = false;
        this.componenti = this.componenti.filter(c => c !== componente);
    }

    /**
     * Indicates whether a squadra can be accepted
     * @param target The instance of squadra to be accepted
     */
    public canYouAcceptSquadra(target: any): boolean {
        return true;
    }

    /**
     * Accept a squadra
     * @param The squadra being accepted
     */
    public acceptSquadra(target: any): void {
        this.compositoreService.addSquadraAMezzo(target, this);
    }
}
