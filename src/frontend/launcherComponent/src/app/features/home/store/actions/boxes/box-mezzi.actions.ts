// Model
import { BoxMezzi } from '../../../boxes/boxes-model/box-mezzi.model';

export class FetchBoxMezzi {
  static readonly type = '[BoxMezzi] Fetch data';
}

export class SetBoxMezzi {
  static readonly type = '[BoxMezzi] Set data';

  constructor(public payload: BoxMezzi) {}
}
