export interface ViewInterface {
    layout?: ViewInterfaceLayout;
    components?: ViewInterfaceComponent;
    maps?: ViewInterfaceMaps;
}

export interface ViewInterfaceLayout {
    split?: boolean;
    columns?: string[];
    button?: ViewInterfaceButton;
    composizione?: ViewInterfaceComposizione;
}

export interface ViewInterfaceComponent {
    mappa?: boolean;
    richieste?: boolean;
    chiamata?: boolean;
    comp_partenza?: boolean;
}

export interface ViewInterfaceMaps {
    active?: string;
}

export interface ViewInterfaceButton {
    chiamata?: string;
    buttonView?: string[];
}

export interface ViewInterfaceComposizione {
    disable: boolean;
    column: string;
    modalita: string;
}
