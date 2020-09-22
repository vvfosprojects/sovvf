export interface ChangelogInterface {
    dataRilascio: string;
    capitoli?: CapitoloInterface[];
    descrizione?: string;
}

interface CapitoloInterface {
    titolo: string;
    descrizione: string;
}
