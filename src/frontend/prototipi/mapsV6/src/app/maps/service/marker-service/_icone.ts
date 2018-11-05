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
    private iconeTipoSedi: [string, string][];
    private mapIconeTipoSedi: Map<string, string>;
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
            ['sede', 'sedi/'],
            ['tipo-sede', 'tipo-sedi/']
        ];
        this.mapIconeModelloPath = new Map(this.iconeModello);

        this.iconeStati = [
            ['chiam', 'danger.png'],
            ['asseg', 'info.png'],
            ['presi', 'success.png'],
            ['sospe', 'warning.png'],
            ['chius', 'secondary.png']
        ];
        this.mapIconeUrl = new Map(this.iconeStati);

        this.iconeGrandezza = [
            [1, '32/'],
            [2, '40/'],
            [3, '48/'],
            [4, '56/'],
            [5, '64/']
        ];
        this.mapIconeSize = new Map(this.iconeGrandezza);

        this.iconeTipoSedi = [
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
        this.mapIconeTipoSedi = new Map(this.iconeTipoSedi);

        // this.iconeMezzi = [
        //     ['insed', 'insede.png'],
        //     ['invia', 'inviaggio.png'],
        //     ['inrie', 'inrientro.png'],
        //     ['sulpo', 'sulposto.png'],
        //     ['istit', 'istituto.png']
        // ];
        this.iconeMezzi = [
            ['insed', 'insede2.png'],
            ['invia', 'inviaggio2.png'],
            ['inrie', 'inrientro2.png'],
            ['sulpo', 'sulposto2.png'],
            ['istit', 'istituto2.png']
        ];
        this.mapIconeMezzi = new Map(this.iconeMezzi);

        this.iconeSedi = [
            ['comando', 'sede5.png'],
            ['distaccamento', 'sede5.png'],
            ['direzioni', 'sede5.png']
        ];
        this.mapIconeSedi = new Map(this.iconeSedi);
    }

    tipoIcona(marker: any, modello: string, markerS: boolean): string {
        /**
         * metodo che mi ritorna il tipo di icona da utilizzare
         */
        const pathModello = this.mapIconeModelloPath.get(modello);
        const path = this.pathUrl + pathModello;
        const check = !(markerS);
        let dir = check ? path + 'ns/' : path + 's/';
        /**
         * verifico se il marker è opaco, e cambio directory
         */
        if (modello !== 'tipo-sede' && marker.opacita) {
            dir = path + 'o/';
        }
        if (marker) {
            switch (modello) {
                case 'richiesta': {
                    this.iconaStatoCorrenteSize = this.mapIconeSize.get(marker.priorita);
                    const statoRichiesta = this.mapIconeUrl.get(marker.stato.substring(0, 5).toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + this.iconaStatoCorrenteSize + statoRichiesta;
                    if (!this.iconaStatoCorrenteSize || !statoRichiesta) {
                        return undefined;
                    }
                    break;
                }
                case 'mezzo': {
                    const tipoMezzo = this.mapIconeMezzi.get(marker.mezzo.stato.substring(0, 5).toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + tipoMezzo;
                    if (!this.iconaStatoCorrenteUrl || !tipoMezzo) {
                        return undefined;
                    }
                    break;
                }
                case 'sede': {
                    const sede = this.mapIconeSedi.get(marker.tipo.toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + sede;
                    if (!this.iconaStatoCorrenteUrl || !sede) {
                        return undefined;
                    }
                    break;
                }
                case 'tipo-sede': {
                    const tipoSede = this.mapIconeTipoSedi.get(marker.tipo.toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + tipoSede;
                    if (!this.iconaStatoCorrenteUrl || !tipoSede) {
                        return undefined;
                    }
                    break;
                }
            }
            return this.iconaStatoCorrenteUrl;
        }
    }
}
