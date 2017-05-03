export class MezzoInServizio {
  

  constructor(public Codice: string,
   public CodiceUnitaOperativa: string,
   public Sigla: string,
   public Genere: string,
   public Targa: string,
   public CodiceStato: string,
   public DataOra: Date,
   public CodiceRichiestaAssistenza: string,
   public Disponibile: boolean,
   public SiglaSquadra: string,
   public Turno: string,
   public DataServizio: Date
   ) {}
 }



export class SquadraSulMezzo {
   constructor ( public Qualifica: string,
   public CodiceFiscale : string,
   public Ruolo: string,
   public Nominativo: string) {}
}