// Models
import { Menu } from '../../maps-ui/filtro/maps-filtro.service';

export class SetVociMenu {
  static readonly type = '[MapsFiltro] Set Voci Menu';

  constructor(public vociMenu: Menu[]) {}
}
