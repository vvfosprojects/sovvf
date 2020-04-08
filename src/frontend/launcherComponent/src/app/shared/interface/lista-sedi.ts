export interface ListaSedi {
    text: string;
    value: any;
    disabled?: boolean;
    checked?: boolean;
    collapsed?: boolean;
    children?: ListaSedi[];
}

export interface ListaSediAPI {
    nome: string;
    codice: any;
    figli?: ListaSediAPI[];
}
