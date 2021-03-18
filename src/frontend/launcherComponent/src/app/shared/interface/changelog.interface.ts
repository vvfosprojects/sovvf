export interface ChangelogInterface {
    nomeVersione: string;
    dataRilascio: string;
    capitoli?: CapitoloInterface[];
    descrizione?: string;
}

interface CapitoloInterface {
    titolo: string;
    descrizioni: DescrizioneInterface[];
}

interface DescrizioneInterface {
    testo: string;
    img?: string;
}
