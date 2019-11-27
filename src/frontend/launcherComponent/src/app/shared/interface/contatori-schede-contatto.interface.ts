export interface ContatoriSchedeContatto {
  totaleSchede: ContatoreSchedeContatto;
  competenzaSchede: ContatoreSchedeContatto;
  conoscenzaSchede: ContatoreSchedeContatto;
  differibileSchede: ContatoreSchedeContatto;
}

interface ContatoreSchedeContatto {
  contatoreTutte: number;
  contatoreLette: number;
  contatoreGestite: number;
}
