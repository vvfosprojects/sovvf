export let APP_TIPOLOGIE: TipologieInterface[] = [];

export interface TipologieInterface {
    codice: string;
    categoria: string;
    descrizione: string;
    star: boolean;
}
