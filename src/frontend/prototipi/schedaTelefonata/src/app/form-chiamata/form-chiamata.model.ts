export class FormChiamataModel {
    numero_chiamata : string;
    data_chiamata : number = Date.now();
    ora_chiamata : number = Date.now();
    operatore : string;
    ragione_sociale: string;
    scheda_contatto: string;
    tipo_interv: string;
    cognome: string;
    nome: string;
    telefono : string;
    coordinate : string;
    indirizzo: string;
    zona_emergenza : string;
    tag: string;
    motivazione: string;
    note_indirizzo: string;
    note_pubbliche: string;
    note_private: string;

    constructor(){
    }

    
}
