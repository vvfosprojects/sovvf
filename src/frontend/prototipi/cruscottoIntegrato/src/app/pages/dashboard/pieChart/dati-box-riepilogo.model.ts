export enum StatoMeteo { Sole, SoleNuvola, Nuvoloso, Pioggerella, Pioggia, Temporale };

export class DatiBoxRiepilogo {
    constructor(
        public richiesteInCoda: number,
        public richiesteInCorso: number,
        public erroreBoxRichieste: string,

        public mezziImpegnati: number,
        public mezziInServizio: number,
        public erroreBoxMezzi: string,

        public squadreImpegnate: number,
        public squadreInServizio: number,
        public erroreBoxSquadre: string,

        public descrizioneMeteo: string,
        public statoMeteo: StatoMeteo,
        public erroreBoxMeteo: string
    ) { }

    public get percentualeRichieste(): number {
        const mediaRichieste = 26;
        return (this.richiesteInCoda + this.richiesteInCorso) / mediaRichieste * 100;
    }

    public get percentualeMezzi(): number {
        const mezziTotali = 34;
        return this.mezziInServizio / mezziTotali * 100;
    }

    public get percentualeSquadre(): number {
        const squadreTotali = 26;
        return this.squadreInServizio / squadreTotali * 100;
    }

    public static getFake(): DatiBoxRiepilogo {
        return new DatiBoxRiepilogo(
            2,
            12,
            null,
            14,
            26,
            null,
            14,
            20,
            null,
            "Soleggiato",
            StatoMeteo.Sole,
            null
        );
    }

    public modificaRandom(): void {
        let rnd = Math.random();

        if (rnd > .9) {
            if (!this.erroreBoxMeteo) {
                this.erroreBoxMeteo = "Simulazione perdita di connessione";
            } else {
                this.erroreBoxMeteo = null;
            }
        }

        if (rnd > .5) {
            Math.random() > .5 ? this.mezziImpegnati++ : this.mezziImpegnati--;
            if (this.mezziImpegnati < 0) //mai negativo
                this.mezziImpegnati = 2;
            this.squadreImpegnate = this.mezziImpegnati;
        }

        if (rnd > .5) {
            Math.random() > .5 ? this.richiesteInCoda++ : this.richiesteInCoda--;
            if (this.richiesteInCoda < 0) //mai negativo
                this.richiesteInCoda = 2;
        }

        if (rnd > .5) {
            Math.random() > .5 ? this.richiesteInCorso++ : this.richiesteInCorso--;
            if (this.richiesteInCorso < 0) //mai negativo
                this.richiesteInCorso = 2;
        }
    }
}