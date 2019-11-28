import { ContatoreSchedeContatto, ContatoriSchedeContatto } from '../interface/contatori-schede-contatto.interface';
import { ContatoreSchedeContattoModel } from './contatore-schede-contatto.model';

export class ContatoriSchedeContattoModel implements ContatoriSchedeContatto {
  public competenzaSchede: ContatoreSchedeContatto;
  public conoscenzaSchede: ContatoreSchedeContatto;
  public differibileSchede: ContatoreSchedeContatto;
  public totaleSchede: ContatoreSchedeContatto;

  constructor() {
    this.competenzaSchede = new ContatoreSchedeContattoModel();
    this.conoscenzaSchede = new ContatoreSchedeContattoModel();
    this.differibileSchede = new ContatoreSchedeContattoModel();
    this.totaleSchede = new ContatoreSchedeContattoModel();
  }
}
