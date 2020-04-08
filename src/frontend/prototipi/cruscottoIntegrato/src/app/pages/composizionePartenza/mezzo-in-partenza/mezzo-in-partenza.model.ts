import { ComponenteInPartenza } from '../componente-in-partenza/componente-in-partenza.model';
import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';
import { Squadra } from '../squadra/squadra.model';
import { Mezzo } from '../mezzo/mezzo.model';
import { CompositoreService } from '../compositore/compositore.service';

export class MezzoInPartenza {
    private componenti: ComponenteInPartenza[] = [];
    constructor(public mezzo: Mezzo,
        private compositoreService: CompositoreService) { }

    /**
     * Imposta l'autista del mezzo. Sostituisce l'autista corrente, se presente, con il nuovo autista.
     * Il vecchio autista resta tra i componenti del mezzo in partenza.
     * @param autista E' il nuovo autista 
     */
    public addAutista(autista: ComponenteInPartenza): void {
        this.componenti.forEach(c => c.autista = false);
        autista.autista = true;
        if (!this.esisteComponente(autista.componente.codiceFiscale))
            this.componenti.push(autista);
    }

    /**
     * Rimuove un mezzo in partenza dalla composizione
     */
    public rimuovi(): void {
        this.compositoreService.removeMezzo(this);
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
    public get esisteAutista(): boolean {
        return !!this.componenti.find(c => c.autista);
    }

    /**
     * Restituisce l'autista se esiste
     */
    public get getAutista(): ComponenteInPartenza {
        return this.componenti.find(c => c.autista);
    }

    /**
     * Restituisce i componenti non autisti della partenza
     */
    public get getComponentiNonAutisti(): ComponenteInPartenza[] {
        return this.componenti.filter(c => !c.autista);
    }

    /**
     * Aggiunge una squadra al mezzo, limitatamente ai componenti non già InPartenza.
     * Imposta InPartenza tutti i componenti. Se non c'è un autista,
     * questo viene impostato al primo autista disponibile nella squadra. Se non c'è un capopartenza,
     * questo viene impostato al primo capopartenza disponibile nella squadra.
     * @param squadra La squadra da aggiungere
     */
    public addSquadra(squadra: Squadra): void {
        var componentiInPartenza = squadra.componenti
            .filter(c => !c.inPartenza)
            .map(c => new ComponenteInPartenza(c));

        //accodamento dei nuovi componenti ai vecchi
        this.componenti = [...this.componenti, ...componentiInPartenza];

        this.setPrimoAutistaSeNonEsistente();
        this.setPrimoCapopartenzaSeNonEsistente();
    }

    private setPrimoAutistaSeNonEsistente(): void {
        //impostazione dell'autista se non già esistente
        var esisteAutista = !!this.componenti.find(c => c.autista);
        if (!esisteAutista) {
            var primoAutista = this.componenti.find(c => c.componente.autista);
            if (!!primoAutista)
                primoAutista.autista = true;
        }
    }

    private setPrimoCapopartenzaSeNonEsistente(): void {
        //impostazione del capopartenza se non già esistente
        var esisteCapoPartenza = !!this.componenti.find(c => c.capoPartenza);
        if (!esisteCapoPartenza) {
            var primoCapoPartenza = this.componenti.find(c => c.componente.capoPartenza);
            if (!!primoCapoPartenza)
                primoCapoPartenza.capoPartenza = true;
        }
    }

    /**
     * Aggiunge un componente al mezzo. Imposta il componente inPartenza. Se non c'è un autista,
     * e il componenteè un autista, questo viene impostato come autista del mezzo.
     * Se non c'è un capopartenza, e il componente è un capopartenza, questo viene impostato come
     * capopartenza nella squadra.
     * @param componente Il componente da aggiungere
     */
    public addComponente(componente: ComponenteSquadra): void {
        // se il componente già è nel mezzo in partenza, esci
        if (this.esisteComponente(componente.codiceFiscale))
            return;

        // creo l'istanza di ComponenteInPartenza
        var componenteInPartenza = new ComponenteInPartenza(componente);
        this.componenti.push(componenteInPartenza);

        this.setPrimoAutistaSeNonEsistente();
        this.setPrimoCapopartenzaSeNonEsistente();
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
     * Elegge un nuovo autista e un nuovo capoPartenza se necessario.
     * @param componente Il componente da rimuovere.
     */
    public removeComponente(componente: ComponenteInPartenza): void {
        if (!this.esisteComponente(componente.componente.codiceFiscale))
            return;

        componente.componente.inPartenza = false;
        this.componenti = this.componenti.filter(c => c !== componente);

        this.setPrimoAutistaSeNonEsistente();
        this.setPrimoCapopartenzaSeNonEsistente();
    }

    /**
     * Rimuove un componente dal mezzo e lo imposta come non inPartenza.
     * Elegge un nuovo autista e un nuovo capoPartenza se necessario.
     * @param componente Il componente da rimuovere.
     */
    public removeComponenteByCf(componenteCf: string): void {
        let componente = this.componenti.find(c => c.componente.codiceFiscale === componenteCf);

        if (!!componente) {
            this.removeComponente(componente);
        }
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

    /**
     * Indicates whether a componente can be accepted
     * @param target The instance of componente to be accepted
     */
    public canYouAcceptComponente(target: any): boolean {
        return true;
    }

    /**
     * Accept a squadra
     * @param The squadra being accepted
     */
    public acceptComponente(target: any): void {
        this.compositoreService.addComponenteAMezzo(target, this);
    }

    /**
     * Verifica se nel mezzo esiste un componente avente il codice fiscale dato
     * @param codiceFiscale Il codice fiscale del componente
     */
    public esisteComponente(codiceFiscale: string): boolean {
        return (!!this.componenti.find(c => c.componente.codiceFiscale == codiceFiscale));
    }
}
