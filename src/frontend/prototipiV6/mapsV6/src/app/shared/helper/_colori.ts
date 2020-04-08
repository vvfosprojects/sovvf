export class ColoriStatoMezzo {

    private statoEfficienza: [number, string][];
    private mapStatoEfficienza: Map<number, string>;

    private livelloCarburante: [number, string][];
    private mapLivelloCarburante: Map<number, string>;

    private livelloEstinguente: [number, string][];
    private mapLivelloEstinguente: Map<number, string>;

    private appartenenza: [number, string][];
    private mapAppartenenza: Map<number, string>;

    private tipoStato: [string, string][];
    private mapTipoStato: Map<string, string>;

    constructor() {
        this.colorStatoEfficienza();

        this.colorLivelloCarburante();

        this.colorLivelloEstinguente();

        this.colorAppartenenza();

        this.stato();
    }

    /**
     *  mappa dei colori stato efficenza mezzo
     */
    private colorStatoEfficienza() {
        this.statoEfficienza = [
            [0, 'danger'],
            [1, 'warning'],
            [2, 'success'],
            [3, 'success']
        ];
        this.mapStatoEfficienza = new Map(this.statoEfficienza);

    }

    /**
     *  mappa dei colori livello carburante mezzo
     */
    private colorLivelloCarburante() {
        this.livelloCarburante = [
            [0, 'default'],
            [1, 'danger'],
            [2, 'danger'],
            [3, 'warning'],
            [4, 'success']
        ];
        this.mapLivelloCarburante = new Map(this.livelloCarburante);
    }

    /**
     *  mappa dei colori livello estinguente mezzo
     */
    private colorLivelloEstinguente() {
        this.livelloEstinguente = [
            [0, 'default'],
            [1, 'danger'],
            [2, 'danger'],
            [3, 'warning'],
            [4, 'success']
        ];
        this.mapLivelloEstinguente = new Map(this.livelloEstinguente);
    }

    /**
     *  mappa dei colori appartenenza mezzo
     */
    private colorAppartenenza() {
        this.appartenenza = [
            [0, 'default'],
            [1, 'danger'],
            [2, 'danger'],
            [3, 'warning'],
            [4, 'success']
        ];
        this.mapAppartenenza = new Map(this.appartenenza);
    }

    /**
     *  mappa dei metodi helper da richiamare all'occorrenza
     */
    private stato() {
        this.tipoStato = [
            ['efficienza', 'mapStatoEfficienza'],
            ['carburante', 'mapLivelloCarburante'],
            ['estinguente', 'mapLivelloEstinguente'],
            ['appartenenza', 'mapAppartenenza']
        ];
        this.mapTipoStato = new Map(this.tipoStato);
    }

    /**
     * metodo che ritorna il colore, passando il valore e il tipo dello stato del mezzo,
     * come parametro opzionale il nome della classe bootstrap da appendere
     * @param stato
     * @param tipostato
     * @param classBootstrap
     */
    getColor(stato: string | number, tipostato: string, classBootstrap?: string) {
        const method = this.mapTipoStato.get(tipostato);
        const colore = this[method].get(stato);
        const color_default = 'guida';
        const classe = classBootstrap ? classBootstrap + '-' : '';
        return colore ? classe + colore : color_default;
    }

}
