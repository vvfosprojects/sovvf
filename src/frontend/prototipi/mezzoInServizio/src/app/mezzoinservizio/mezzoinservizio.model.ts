import { PersonaSulMezzo } from "./persona-sul-mezzo.model";
import { StatiSuccessivi } from "app/mezzoinservizio/codici-stato-mezzo-succ.model";

export class MezzoInServizio {
  private _testoRicercabile: string[];

  constructor(public codice: string,
    public descrizioneUnitaOperativa: string,
    public descrizione: string,  /// descrizione è la sigla ed il genere mezzo
    public targa: string,
    public codiceStato: string,
    public istanteAggiornamentoStato: Date,
    public codiceRichiestaAssistenza: string,
    public disponibile: boolean,
    public descrizioneSquadra: string,  /// è il turno e la data servizio
    public tooltipSquadra: string,

    /**
     * Rappresenta l'elenco delle persone che sono presenti sul mezzo
     */
    public personeSulMezzo: PersonaSulMezzo[],
     /**
     * Stati del mezzo successivi
     */
    public codiciStatoSucc: StatiSuccessivi[]
 
  ) {
    this._testoRicercabile = this.calcolaTestoRicercabile();
  }

  public calcolaTestoRicercabile(): string[] {
    let v = [
      this.descrizioneUnitaOperativa,
      this.descrizione,
      this.targa,
      this.codiceRichiestaAssistenza,
      this.descrizioneSquadra
    ];

    this.personeSulMezzo.map(p => p.descrizione).forEach(desc => v.push(desc));

    return v;
  }

  public ricercaFullText(chiave: string): boolean {
    return this._testoRicercabile.some(p => p === chiave);
  }

  public testoRicercabile(): string[] {
    return this._testoRicercabile;
  }
}