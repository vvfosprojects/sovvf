/**
 *  classe che ritorna l'url del marker da visualizzare sulla mappa
 */
export class IconMappe {
    /**
     * proprietà per definire lo status dell'oggetto icona marker della mappa
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
    private iconeSpeciali: [string, string][];
    private mapIconeSpeciali: Map<string, string>;

    /**
     * proprietà per definire lo status dell'oggetto icona marker corrente nella mappa
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
        this.pathUrl = 'assets/img/icone-markers/';

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
            ['insed', 'insede.png'],
            ['invia', 'inviaggio.png'],
            ['inrie', 'inrientro.png'],
            ['sulpo', 'sulposto.png'],
            ['istit', 'istituto.png']
        ];

        this.mapIconeMezzi = new Map(this.iconeMezzi);

        this.iconeSedi = [
            ['comando', 'sede5.png'],
            ['distaccamento', 'sede5.png'],
            ['direzioni', 'sede5.png']
        ];
        this.mapIconeSedi = new Map(this.iconeSedi);

        this.iconeSpeciali = [
            ['meteo', 'speciali/marker-meteo-32.png'],
            ['chiamata', 'speciali/chiamata-marker-rosso.png']
        ];
        this.mapIconeSpeciali = new Map(this.iconeSpeciali);
    }

    iconaSpeciale(tipo: string): string {
        return this.pathUrl + this.mapIconeSpeciali.get(tipo);
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

    /**
     * metodo che ritorna un array di stringhe con tutti i path di tutte le icone
     * l'array in oggetto sarà utilizzato per mettere in cache tutte le icone su agm
     * (workaround del bug di agm/core)
     */
    urlIcone(): string[] {
        const result: string[] = [];
        /**
         * tipi di icone da cachare
         */
        const cache = ['richiesta', 'mezzo', 'sede'];
        const path = this.pathUrl;
        const selezionato = ['ns/', 's/'];
        cache.forEach(c => {
            const pathComune = path + this.mapIconeModelloPath.get(c);
            selezionato.forEach(tipo => {
                switch (c) {
                    case 'richiesta': {
                        this.mapIconeSize.forEach(size => {
                            this.mapIconeUrl.forEach(stati => {
                                result.push(pathComune + tipo + size + stati);
                            });
                        });
                        break;
                    }
                    case 'mezzo': {
                        this.mapIconeMezzi.forEach(mezzi => {
                            result.push(pathComune + tipo + mezzi);
                        });
                        break;
                    }
                    case 'sede': {
                        this.mapIconeSedi.forEach(sedi => {
                            result.push(pathComune + tipo + sedi);
                        });
                        break;
                    }
                }
            });
        });
        /**
         * metto in cache anche le icone "speciali"
         */
        this.mapIconeSpeciali.forEach(speciali => {
            result.push(path + speciali);
        });
        return result;
    }
}
