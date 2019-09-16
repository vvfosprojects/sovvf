export class ReducerFiltroMarker {
  static readonly type = '[MapsFiltro] Reducer Filtro Marker';

  constructor(public selected: string) {
  }
}

export class SetFiltroMarker {
    static readonly type = '[MapsFiltro] Set Filtro Marker';

    constructor(public selected: string) {
    }
}

export class SetFiltriMarker {
    static readonly type = '[MapsFiltro] Set Filtri Marker';

    constructor(public selected: string[]) {
    }
}

export class CopiaFiltroAttivo {
    static readonly type = '[MapsFiltro] Copia Filtro Attivo';
}

export class ClearCopiaFiltroAttivo {
    static readonly type = '[MapsFiltro] Clear Filtro Attivo';
}
