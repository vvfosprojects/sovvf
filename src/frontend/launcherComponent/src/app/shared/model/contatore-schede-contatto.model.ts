import { ContatoreSchedeContatto } from '../interface/contatori-schede-contatto.interface';

export class ContatoreSchedeContattoModel implements ContatoreSchedeContatto {
  public contatoreDaGestire: number;
  public contatoreDaLeggere: number;
  public contatoreTutte: number;

  constructor() {
    this.contatoreDaGestire = 0;
    this.contatoreDaLeggere = 0;
    this.contatoreTutte = 0;
  }
}
