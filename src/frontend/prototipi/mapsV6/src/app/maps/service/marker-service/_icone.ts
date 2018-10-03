/**
 *  classe che ritorna l'url del marker da visualizzare sulla mappa
 */
export class IconMappe {
    /**
     * proprietà per definire lo status dell'oggetto marker della mappa
     */
    private pathUrl: string;
    private iconeModello: [string, string][];
    private mapIconeModelloPath: Map<string, string>;
    private iconeStati: [string, string][];
    private mapIconeUrl: Map<string, string>;
    private iconeGrandezza: [number, string][];
    private mapIconeSize: Map<number, string>;
    private iconeSedi: [string, string][];
    private mapIconeSedi: Map<string, string>;
    private iconeMezzi: [string, string][];
    private mapIconeMezzi: Map<string, string>;

    /**
     * proprietà per definire lo status dell'oggetto marker corrente nella mappa
     */
    private iconaStatoCorrenteUrl: string;
    private iconaStatoCorrenteSize: string;

    constructor() {
        /**
         *  inizializzo i marker di tipo icona da utilizzare nella mappa
         */
        this.icone();
    }

    private icone() {
        /**
         * creo delle mappe di oggetti per ricavare il path dell'immagine date le proprietà del marker
         */
        this.pathUrl = '../../../../assets/img/icone-markers/';

        this.iconeModello = [
            ['richiesta', 'richieste/'],
            ['mezzo', 'mezzi/'],
            ['sede', 'sedi/']
        ];
        this.mapIconeModelloPath = new Map(this.iconeModello);

        this.iconeStati = [
            ['chiam', 'warning.png'],
            ['asseg', 'info.png'],
            ['presi', 'success.png'],
            ['sospe', 'secondary.png']
        ];
        this.mapIconeUrl = new Map(this.iconeStati);

        this.iconeGrandezza = [
            [1, '20/'],
            [2, '25/'],
            [3, '30/'],
            [4, '35/'],
            [5, '40/']
        ];
        this.mapIconeSize = new Map(this.iconeGrandezza);

        this.iconeSedi = [
            ['aeroportuale', 'aeroportuale.gif'],
            ['afmp', 'afmp.jpg'],
            ['centri_polifunzionali', 'centri_polifunzionali.gif'],
            ['cinofili', 'cinofili.gif'],
            ['comando', 'comando.gif'],
            ['direzioni', 'direzioni.gif'],
            ['elicotteristi', 'elicotteristi.gif'],
            ['nbcr', 'nbcr.gif'],
            ['nbcr_avanzato', 'nbcr_avanzato.gif'],
            ['nbcr_ordinari', 'nbcr_ordinari.gif'],
            ['poli_didattici', 'poli_didattici.gif'],
            ['portuale', 'portuale.gif'],
            ['presidi_acquatici', 'presidi_acquatici.gif'],
            ['saf', 'saf.gif'],
            ['distaccamento', 'sedi.gif'],
            ['sedi_varie', 'sedi_varie.gif'],
            ['sommozzatori', 'sommozzatori.gif'],
            ['telecomunicazioni', 'telecomunicazioni.gif'],
            ['tlc', 'tlc.gif'],
            ['uas', 'uas.gif'],
            ['volontari', 'volontari.gif'],
            ['volontari_stag', 'volontari_stag.gif']
        ];
        this.mapIconeSedi = new Map(this.iconeSedi);

        this.iconeMezzi = [
            ['autobotte', 'default.png']
        ];
        this.mapIconeMezzi = new Map(this.iconeMezzi);
    }

    tipoIcona(marker: any, modello: string, markerS: any): string {
        /**
         * metodo che mi ritorna il tipo di icona da utilizzare
         */
        const pathModello = this.mapIconeModelloPath.get(modello);
        const path = this.pathUrl + pathModello;
        const check = !(markerS === marker || markerS === marker.id);
        const dir = check ? path + 'ns/' : path + 's/';
        if (marker) {
            switch (modello) {
                case 'richiesta': {
                    this.iconaStatoCorrenteSize = this.mapIconeSize.get(marker.priorita);
                    this.iconaStatoCorrenteUrl = dir + this.iconaStatoCorrenteSize
                        + this.mapIconeUrl.get(marker.stato.substring(0, 5).toLowerCase());
                    if (!this.iconaStatoCorrenteSize) {
                        return dir + '30/success.png';
                    }
                    return this.iconaStatoCorrenteUrl;
                }
                case 'mezzo': {
                    this.iconaStatoCorrenteUrl = dir + this.mapIconeMezzi.get(marker.mezzo.descrizione.toLowerCase());
                    if (!this.iconaStatoCorrenteUrl) {
                        return dir + 'default.png';
                    }
                    return this.iconaStatoCorrenteUrl;
                }
                case 'sede': {
                    this.iconaStatoCorrenteUrl = dir + this.mapIconeSedi.get(marker.tipologia.toLowerCase());
                    if (!this.iconaStatoCorrenteUrl) {
                        return null;
                    }
                    return this.iconaStatoCorrenteUrl;
                }
            }
        }
    }
}
