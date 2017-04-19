import { DescStatoMap } from './desc-stato-map.class';

export class MezzoInServizio {
  private mapperDescStato = new DescStatoMap();

  constructor(public Codice: string,
   public CodiceUnitaOperativa: string,
   public Sigla: string,
   public Genere: string,
   public Targa: string,
   public CodiceStato: string,
   public DataOra: Date,
   public CodiceRichiestaAssistenza: string,
   public Disponibile: boolean
   ) {}

   private getDescrizioneStato(codice: string): string {
     return this.mapperDescStato.map(codice);
   }

 }
