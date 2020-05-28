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
            ['chiam', 'chiamata.png'],
            ['asseg', 'assegnata.png'],
            ['presi', 'presidiata.png'],
            ['sospe', 'sospesa.png'],
            ['chius', 'chiusa.png']
        ];
        this.mapIconeUrl = new Map(this.iconeStati);

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
            ['direzioni', 'sede5.png'],
            ['default', 'sede5.png']
        ];
        this.mapIconeSedi = new Map(this.iconeSedi);

        this.iconeSpeciali = [
            ['meteo', 'speciali/marker-meteo-32.png'],
            ['chiamata', 'speciali/chiamata-marker-rosso.png'],
            ['Competenza', 'speciali/scheda-contatto-marker.png'],
            ['Conoscenza', 'speciali/scheda-contatto-marker-conoscenza.png'],
            ['Differibile', 'speciali/scheda-contatto-marker-differibile.png'],
            ['Competenza-g', 'speciali/scheda-contatto-marker-g.png'],
            ['Conoscenza-g', 'speciali/scheda-contatto-marker-conoscenza-g.png'],
            ['Differibile-g', 'speciali/scheda-contatto-marker-differibile-g.png'],
        ];
        this.mapIconeSpeciali = new Map(this.iconeSpeciali);
    }

    iconaSpeciale(tipo: string): string {
        return this.pathUrl + this.mapIconeSpeciali.get(tipo);
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
                        this.mapIconeUrl.forEach(stati => {
                            result.push(pathComune + tipo + stati);
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

    iconaMezzo(stato: string, selezionato: boolean): string {
        /**
         * metodo che mi ritorna l'url del' icona mezzoMarker da utilizzare
         */
        const pathModello = this.mapIconeModelloPath.get('mezzo');
        const path = this.pathUrl + pathModello;
        const check = !(selezionato);
        const dir = check ? path + 'ns/' : path + 's/';
        const statoMezzo = stato.split(' ').join('');
        const tipoMezzo = this.mapIconeMezzi.get(statoMezzo.substring(0, 5).toLowerCase());
        this.iconaStatoCorrenteUrl = dir + tipoMezzo;
        if (!this.iconaStatoCorrenteUrl || !tipoMezzo) {
            return undefined;
        }
        return this.iconaStatoCorrenteUrl;
    }

    iconaSede(tipo: any, selezionato: boolean): string {
        /**
         * metodo che mi ritorna l'url del' icona sedeMarker da utilizzare
         */
        const pathModello = this.mapIconeModelloPath.get('sede');
        const path = this.pathUrl + pathModello;
        const check = !(selezionato);
        const dir = check ? path + 'ns/' : path + 's/';
        let sede = this.mapIconeSedi.get(tipo.toLowerCase());
        if (!sede) {
            sede = this.mapIconeSedi.get('default');
        }
        this.iconaStatoCorrenteUrl = dir + sede;
        if (!this.iconaStatoCorrenteUrl || !sede) {
            return undefined;
        }
        return this.iconaStatoCorrenteUrl;
    }

    iconaSchedaContatto(tipo: string): string {
        /**
         * metodo che mi ritorna l'url del' icona da utilizzare per ogni scheda contatto marker
         */
        return this.iconaSpeciale(tipo);
    }

    iconaSedeTipoWindow(tipo: any): string {
        /**
         * metodo che mi ritorna l'url del' icona da utilizzare nell'info window di sede
         */
        const pathModello = this.mapIconeModelloPath.get('tipo-sede');
        const path = this.pathUrl + pathModello;
        const tipoSede = this.mapIconeTipoSedi.get(tipo.toLowerCase());
        this.iconaStatoCorrenteUrl = path + tipoSede;
        if (!this.iconaStatoCorrenteUrl || !tipoSede) {
            return undefined;
        }
        return this.iconaStatoCorrenteUrl;
    }
}
