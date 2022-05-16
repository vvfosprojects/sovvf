import { ContatoreSchedeContatto } from '../interface/contatori-schede-contatto.interface';

export class ContatoreSchedeContattoModel implements ContatoreSchedeContatto {
  public contatoreFiltroAttivo: number;
  public contatoreDaLeggere: number;
  public contatoreTutte: number;

  constructor() {
    this.contatoreFiltroAttivo = 0;
    this.contatoreDaLeggere = 0;
    this.contatoreTutte = 0;
  }
}
