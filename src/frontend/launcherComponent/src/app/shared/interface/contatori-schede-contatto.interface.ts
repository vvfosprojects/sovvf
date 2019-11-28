export interface ContatoriSchedeContatto {
  totaleSchede: ContatoreSchedeContatto;
  competenzaSchede: ContatoreSchedeContatto;
  conoscenzaSchede: ContatoreSchedeContatto;
  differibileSchede: ContatoreSchedeContatto;
}

export interface ContatoreSchedeContatto {
  contatoreTutte: number;
  contatoreDaLeggere: number;
  contatoreDaGestire: number;
}
