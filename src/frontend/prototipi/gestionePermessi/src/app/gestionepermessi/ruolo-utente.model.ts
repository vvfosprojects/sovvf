import { PermessoUtente } from "./permesso-utente.model";

export class RuoloUtente {

  constructor(
      public CodiceUnitaOperativa: string,
  /**
    * Rappresenta l'elenco dei ruoli di un utente
    */
   public permessiUtente: PermessoUtente[]
   ) {}


 }