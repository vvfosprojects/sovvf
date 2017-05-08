import { PersonaSulMezzo } from "./persona-sul-mezzo.model";

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
   public DataServizio: Date,
   
   /**
    * Rappresenta l'elenco delle persone che sono presenti sul mezzo
    */
   public personeSulMezzo: PersonaSulMezzo[]
   ) {}
 }