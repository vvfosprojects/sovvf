import { AppFeatures } from '../enum/app-features.enum';
import { Grid } from '../enum/layout.enum';

export interface ViewLayout {
    active: boolean;
    split?: boolean;
    options?: any[];
}

export interface ViewLayouts {
    richieste: ViewLayout;
    codaChiamate: ViewLayout;
    mappa: ViewLayout;
    chiamata: ViewLayout;
    composizione: ViewLayout;
    filterbar: ViewLayout;
    modifica: ViewLayout;
    mezziInServizio: ViewLayout;
    schedeContatto: ViewLayout;
}

export interface Grids {
    sinistra: Grid;
    destra: Grid;
}

export interface ViewComponentStateModel {
    view: ViewLayouts;
    column: Grids;
    backupViewComponent?: ViewComponentStateModel;
}

export interface ViewInterfaceMaps {
    active: AppFeatures;
}

export interface ViewInterfaceButton {
    chiamata?: string;
    buttonView?: string[];
    backupViewComponent?: ViewComponentStateModel;
}
