// Models
import { BoxPersonale } from '../../boxes-model/box-personale.model';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxInterventi } from '../../boxes-model/box-interventi.model';

export class FetchBoxInterventi {
  static readonly type = '[BoxInterventi] Fetch data';
}

export class SetBoxInterventi {
  static readonly type = '[BoxInterventi] Set data';

  constructor(public payload: BoxInterventi) {}
}

export class FetchBoxMezzi {
  static readonly type = '[BoxMezzi] Fetch data';
}

export class SetBoxMezzi {
  static readonly type = '[BoxMezzi] Set data';

  constructor(public payload: BoxMezzi) {}
}

export class FetchBoxPersonale {
  static readonly type = '[BoxPersonale] Fetch data';
}

export class SetBoxPersonale {
  static readonly type = '[BoxPersonale] Set data';

  constructor(public payload: BoxPersonale) {}
}
