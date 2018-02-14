/**
 * Questa classe viene inviata verso il backend per l'assegnazione di un nuovo permesso di utente
 */
export class NuovoPermesso {

  constructor(
      /**
       * Il codice dell'UO a cui si applica il permesso
       */
      public codiceUnitaOperativa: string,
      
      /**
       * L'indicazione della ricorsività sul permesso
       */
      public ricorsivo: boolean,
      
      /**
       * Il codice fiscale dell'utente a cui si applica il permesso
       */
      public codiceFiscale: string,
      
      /**
       * Il codice del permesso da assegnare
       */
      public codicePermesso: string) {}
 }