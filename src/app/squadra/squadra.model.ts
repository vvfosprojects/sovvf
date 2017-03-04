import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';

export class Squadra {
    private _selezionataDa: string;

    constructor(
        public readonly nome: string,
        public componenti: ReadonlyArray<ComponenteSquadra>
    ) {

    }

    set selezionataDa(utente: string) {
        this._selezionataDa = utente;
    }

    get selezionataDa(): string {
        return this._selezionataDa;
    }

    get selezionata(): boolean {
        return !!this._selezionataDa;
    }

    get numeroComponenti(): number {
        return this.componenti.length;
        
    }

    get numeroComponentiLiberi(): number {
        return this.componenti.filter(c => !c.impegnato).length;
    }
}