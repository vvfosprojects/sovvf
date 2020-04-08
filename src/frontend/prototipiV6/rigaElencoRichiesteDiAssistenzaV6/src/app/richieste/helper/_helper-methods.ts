export class HelperMethods {

    constructor() {
    }

    /* Restituisce un Array con tanti elementi quanto è la priorità dell'intervento */
    vettorePallini(richiesta: any) {
        return new Array(richiesta.priorita);
    }

    /* Restituisce un Array con tanti elementi quanti sono i buchini della priorità dell'intervento */
    vettoreBuchini(richiesta: any) {
        const MAX_PRIORITA = 5;
        return new Array(MAX_PRIORITA - richiesta.priorita);
    }

    /* Restituisce i nomi delle squadre  */
    nomiSquadre(richiesta: any): string[] {
        let nomiSquadre: string[];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: any) => {
                partenza.mezzi.forEach((mezzo: any) => {
                    nomiSquadre = mezzo.squadre.map((s: any) => s.nome);
                });
            });
        }
        return nomiSquadre;
    }

    /* Restituisce il numero delle squadre */
    numeroSquadre(richiesta: any): number {
        let numeroSquadre = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: any) => {
                partenza.mezzi.forEach((mezzo: any) => {
                    numeroSquadre = numeroSquadre + mezzo.squadre.length;
                });
            });
        }
        return numeroSquadre;
    }

    /* Restituisce i nomi dei mezzi  */
    nomiMezzi(richiesta: any): string[] {
        let nomiMezzi = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: any) => {
                nomiMezzi = partenza.mezzi.map((s: any) => s.descrizione);
            });
        }
        return nomiMezzi;
    }

    /* Restituisce il numero dei mezzi */
    numeroMezzi(richiesta: any): number {
        let numeroMezzi = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: any) => {
                numeroMezzi = numeroMezzi + partenza.mezzi.length;
            });
        }
        return numeroMezzi;
    }

    /* Permette di colorare l'icona della tipologia */
    coloraIcona(nome: any): any {
        const colori = [
            {
                icon: 'fa fa-fire',
                color: 'text-danger'
            },
            {
                icon: 'fa fa-exclamation-triangle',
                color: 'text-warning'
            },
            {
                icon: 'fa fa-medkit',
                color: 'text-primary'
            }
        ];

        const colore = colori.find(x => x.icon === nome);
        if (nome === undefined || nome === '') {
            return 'fa fa-exclamation-triangle text-warning';
        } else if (colore !== undefined) {
            return nome + ' ' + colore.color;
        } else {
            return nome + ' guida';
        }
    }

    /* Ritorna true se le parole matchano almeno in parte */
    match(word1: string, word2: string, substr: number) {
        const word1San = word1.toLowerCase().substr(0, word1.length - substr);
        const word2San = word2.toLowerCase().substr(0, word2.length - substr);
        if (word1San === word2San) {
            return true;
        }
    }

    complessitaClass(richiesta: any) {
        return {
            'badge-success': this.match(richiesta.complessita.descrizione, 'bassa', 1),
            'badge-warning': this.match(richiesta.complessita.descrizione, 'media', 1),
            'badge-danger': this.match(richiesta.complessita.descrizione, 'alta', 1)
        };
    }

    /* NgClass Card Status */
    CardClasses(r: any, richiestaSelezionata: any, richiestaHover: any) {
        return {
            // Hover (stato)
            'card-shadow-info': (r === richiestaHover || r === richiestaSelezionata) && this.match(r.stato, 'assegnato', 1),
            'card-shadow-success': (r === richiestaHover || r === richiestaSelezionata) && this.match(r.stato, 'presidiato', 1),
            'card-shadow-danger': (r === richiestaHover || r === richiestaSelezionata) && this.match(r.stato, 'chiamata', 1),
            'card-shadow-warning': (r === richiestaHover || r === richiestaSelezionata) && this.match(r.stato, 'sospeso', 1),
            'card-shadow-secondary': (r === richiestaHover || r === richiestaSelezionata) && this.match(r.stato, 'chiuso', 1),
            'bg-light': (r === richiestaSelezionata || r === richiestaHover) && !this.match(r.stato, 'chiuso', 1),
            'bg-pattern-chiuso': this.match(r.stato, 'chiuso', 1),

            // Bordo sinistro (stato)
            'status_chiamata': this.match(r.stato, 'chiamata', 1),
            'status_presidiato': this.match(r.stato, 'presidiato', 1),
            'status_assegnato': this.match(r.stato, 'assegnato', 1),
            'status_sospeso': this.match(r.stato, 'sospeso', 1),
            'status_chiuso': this.match(r.stato, 'chiuso', 1)
        };
    }

    /* NgClass Card Fissata Status */
    cardFissataClasses(r: any) {
        if (r) {
            return {
                'card-shadow-info': this.match(r.stato, 'assegnato', 1),
                'card-shadow-success': this.match(r.stato, 'presidiato', 1),
                'card-shadow-danger': this.match(r.stato, 'chiamata', 1),
                'card-shadow-warning': this.match(r.stato, 'sospeso', 1),
                'card-shadow-secondary': this.match(r.stato, 'chiuso', 1),
                'bg-pattern-chiuso': this.match(r.stato, 'chiuso', 1),

                // Bordo sinistro (stato)
                'status_chiamata': this.match(r.stato, 'chiamata', 1),
                'status_presidiato': this.match(r.stato, 'presidiato', 1),
                'status_assegnato': this.match(r.stato, 'assegnato', 1),
                'status_sospeso': this.match(r.stato, 'sospeso', 1),
                'status_chiuso': this.match(r.stato, 'chiuso', 1)
            };
        }
    }
}
