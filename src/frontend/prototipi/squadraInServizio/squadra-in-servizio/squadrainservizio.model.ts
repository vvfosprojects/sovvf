import { PersonaDellaSquadra } from "./persona-della-squadra.model";

export class SquadraInServizio {
  private _mostraPersone: boolean = false;

  constructor(public Codice: string,
   public CodiceUnitaOperativa: string,
   public SiglaSquadra: string,
   public Tipo: string,
   public Turno: string,
   public DataServizio: Date,
   public CodiceStato: string,
   public CodiceRichiestaAssistenza: string,
   /**
    * Rappresenta l'elenco delle persone che sono presenti nella squadra
    */
   public personeDellaSquadra: PersonaDellaSquadra[]
   ) {}


   public hideMostraPersone(): void {
        if (this._mostraPersone) 
           this._mostraPersone = false;
        else
           this._mostraPersone = true;
    }

    get mostraPersone(): boolean {
        return this._mostraPersone;
    }

 }