import { PersonaSulMezzo } from "./persona-sul-mezzo.model";

export class MezzoInServizio {

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
    public personeSulMezzo: PersonaSulMezzo[]
  ) { }

  private testoRicercabile(): string[] {
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

  ricerca(chiave: string): boolean {
    console.log(this.testoRicercabile());
    return this.testoRicercabile().some(p => p === chiave);
  }
}