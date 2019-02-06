// Model
import { BoxInterventi } from '../../boxes-model/box-interventi.model';

export class FetchBoxRichieste {
  static readonly type = '[BoxRichieste] Fetch data';
}

export class SetBoxRichieste {
  static readonly type = '[BoxRichieste] Set data';

  constructor(public payload: BoxInterventi) {}
}
