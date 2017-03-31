export class FormschedacontattoModel {
    private _idScheda: Number;
    private _dataOrainserimento: Date;
    private _idOperatore: Number;
    private _idPostazione: string;
    private _nomeUtente: string;
    private _numTelefono: Number;
    private _indirizzo: string;
    private _infoAddizionali: string;
    private _classificazioneNUE: string;
    private _attributiClassificazione: string;
    private _note: string;
    private _numPersoneCoinvolte: string;
    private _competenza: string;
    
    private _inModifica: boolean = false;

    constructor(idScheda : Number)
 {
     this._idScheda = idScheda;
 }   
    /*, dataOrainserimento : Date, idOperatore : Number,
    idPostazione : string, nomeUtente : string,
    numTelefono : Number, indirizzo : string,
    infoAddizionali : string, classificazioneNUE : string,
    attributiClassificazione : string, note : string,
    numPersoneCoinvolte : string, competenza : string) 
    {
        this._idScheda = idScheda;
        this._dataOrainserimento = dataOrainserimento;
        this._idOperatore = idOperatore;
        this._idPostazione = idPostazione;
        this._nomeUtente = nomeUtente;
        this._numTelefono = numTelefono;
        this._indirizzo = indirizzo;   
        this._infoAddizionali = infoAddizionali;   
        this._classificazioneNUE = classificazioneNUE;   
        this._attributiClassificazione = attributiClassificazione;   
        this._note = note;   
        this._numPersoneCoinvolte = numPersoneCoinvolte;   
       this._competenza = competenza;   
     }
    get idScheda(): Number {
        return this._idScheda;
    }

    set dataOrainserimento(dataOrainserimento: Date) {
         this._dataOrainserimento = dataOrainserimento;
    }

    get idOperatore(): Number {
        return this._idOperatore;
    }

   get idScheda(): Number {
        return this._idScheda;
    }

    set dataOrainserimento(dataOrainserimento: Date) {
         this._dataOrainserimento = dataOrainserimento;
    }*/

    get idScheda(): Number {
        return this._idScheda;
    }

    set idScheda(idScheda: Number) {
         this._idScheda = idScheda;
    }

}
















