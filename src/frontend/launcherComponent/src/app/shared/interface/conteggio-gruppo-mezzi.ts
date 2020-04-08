export interface ConteggioGruppoMezzi {
    totale: number;
    items: ItemMezzoGroup[];
}

interface ItemMezzoGroup {
    descrizione: string;
    totale: number;
    items: ItemMezzoGroup[];
}
