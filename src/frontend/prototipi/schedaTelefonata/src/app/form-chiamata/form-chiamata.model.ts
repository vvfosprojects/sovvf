import { Punto } from "app/form-chiamata/punto.model";
import { RisultatoRicerca } from "app/ricerca/risultato-ricerca";

export class FormChiamataModel {
    numeroChiamata : string;
    istanteChiamata : number = Date.now();
    operatore : string;
    ragione_sociale: string;
    scheda_contatto: string;
    tipo_interv: RisultatoRicerca[];
    cognome: string;
    nome: string;
    telefono : string;
    coordinate : Punto;
    indirizzo: string;
    zona_emergenza : string;
    tags: string[];
    motivazione: string;
    note_indirizzo: string;
    note_pubbliche: string;
    note_private: string;

    constructor(){
    }

    
}
