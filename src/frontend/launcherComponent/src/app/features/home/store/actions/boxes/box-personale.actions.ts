// Model
import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';

export class FetchBoxPersonale {
  static readonly type = '[BoxPersonale] Fetch data';
}

export class SetBoxPersonale {
  static readonly type = '[BoxPersonale] Set data';

  constructor(public payload: BoxPersonale) {}
}
