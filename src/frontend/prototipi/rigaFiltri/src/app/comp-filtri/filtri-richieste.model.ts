
export class FiltriRichieste {
    
  constructor(
    public chiamate : boolean,
    public interventi : boolean,
    public aperti : boolean,
    public chiusi : boolean,
    public interni : boolean,
    public esterni : boolean,
    public presidiati : boolean,
    public nonPresidiati : boolean,
    public chiaveDiRicerca ?: string
    ) {

    }
}