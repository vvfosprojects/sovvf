// Model
import { BoxInterventi } from '../../../boxes/boxes-model/box-interventi.model';

export class GetBoxRichieste {
  static readonly type = '[BoxRichieste] Get data';
}

export class SetBoxRichieste {
  static readonly type = '[BoxRichieste] Set data';

  constructor(public payload: BoxInterventi) {}
}

export class ClearBoxRichieste {
  static readonly type = '[BoxRichieste] Clear data';
}
