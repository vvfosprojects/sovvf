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

        this.iconeMezzi = [
            ['autobotte', 'mezzo.png'],
            ['autobotte2', 'mezzo2.png'],
            ['autobotte3', 'mezzo3.png']
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
        const dir = check ? path + 'ns/' : path + 's/';
        if (marker) {
            switch (modello) {
                case 'richiesta': {
                    this.iconaStatoCorrenteSize = this.mapIconeSize.get(marker.priorita);
                    const statoRichiesta = this.mapIconeUrl.get(marker.stato.substring(0, 5).toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + this.iconaStatoCorrenteSize + statoRichiesta;
                    if (!this.iconaStatoCorrenteSize || !statoRichiesta) {
                        return undefined;
                    }
                    return this.iconaStatoCorrenteUrl;
                }
                case 'mezzo': {
                    const tipoMezzo = this.mapIconeMezzi.get(marker.mezzo.descrizione.toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + tipoMezzo;
                    if (!this.iconaStatoCorrenteUrl || !tipoMezzo) {
                        return undefined;
                    }
                    return this.iconaStatoCorrenteUrl;
                }
                case 'sede': {
                    const sede = this.mapIconeSedi.get(marker.tipo.toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + sede;
                    if (!this.iconaStatoCorrenteUrl || !sede) {
                        return undefined;
                    }
                    return this.iconaStatoCorrenteUrl;
                }
                case 'tipo-sede': {
                    const tipoSede = this.mapIconeTipoSedi.get(marker.tipo.toLowerCase());
                    this.iconaStatoCorrenteUrl = dir + tipoSede;
                    if (!this.iconaStatoCorrenteUrl || !tipoSede) {
                        return undefined;
                    }
                    return this.iconaStatoCorrenteUrl;
                }
            }
        }
    }
}
