import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { Partenza } from '../../../../shared/model/partenza.model';
import { Squadra } from '../../../../shared/model/squadra.model';
import { ColoriStatoMezzo } from '../../../../shared/helper/_colori';
import { TipoTerrenoEnum } from '../../../../shared/enum/tipo-terreno.enum';
import { TipoTerreno } from '../../../../shared/model/tipo-terreno';
import { TipoTerrenoMqHa } from '../../../../shared/interface/tipo-terreno-mq-ha';
import { AttivitaUtente } from '../../../../shared/model/attivita-utente.model';

export class HelperSintesiRichiesta {

    stato = new ColoriStatoMezzo();

    /* Restituisce i nomi delle squadre  */
    nomiSquadre(richiesta: SintesiRichiesta): string[] {
        let nomiSquadre: string[] = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: Partenza) => {
                nomiSquadre = partenza.squadre.map((s: Squadra) => s.nome);
            });
        }
        return nomiSquadre;
    }

    /* Restituisce il numero delle squadre */
    numeroSquadre(richiesta: SintesiRichiesta): number {
        let numeroSquadre = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: Partenza) => {
                numeroSquadre += partenza.squadre.length;
            });
        }
        return numeroSquadre;
    }

    /* Restituisce i nomi dei mezzi  */
    nomiMezzi(richiesta: SintesiRichiesta): string[] {
        const nomiMezzi = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: Partenza) => {
                nomiMezzi.push(partenza.mezzo.codice);
            });
        }
        return nomiMezzi;
    }

    /* Restituisce il numero dei mezzi */
    numeroMezzi(richiesta: SintesiRichiesta): number {
        let numeroMezzi = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach((partenza: Partenza) => {
                if (partenza.mezzo) {
                    numeroMezzi++;
                }
            });
        }
        return numeroMezzi;
    }

    /* Permette di colorare l'icona della tipologia */
    coloraIcona(nome: any): any {
        if (nome) {
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

            const colore = nome ? colori.find(x => x.icon === nome) : undefined;
            if (!nome || nome === '') {
                return 'fa fa-exclamation-triangle text-warning';
            } else if (colore !== undefined) {
                return nome + ' ' + colore.color;
            } else {
                return nome + ' guida';
            }
        } else {
            return 'fa fa-exclamation-triangle text-warning';
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

    toggleEspansoClass(espanso: boolean) {
        let returnClass = '';

        if (!espanso) {
            returnClass = 'fa-long-arrow-down';
        } else {
            returnClass = 'fa-long-arrow-up';
        }

        return returnClass;
    }

    complessitaClass(richiesta: any) {
        if (richiesta.complessita) {
            return {
                'badge-success': this.match(richiesta.complessita.descrizione, 'bassa', 1),
                'badge-warning': this.match(richiesta.complessita.descrizione, 'media', 1),
                'badge-danger': this.match(richiesta.complessita.descrizione, 'alta', 1)
            };
        }
    }

    /* NgClass Card Status */
    cardClasses(r: SintesiRichiesta, richiestaSelezionata: any, richiestaHover: any) {
        const classes = {
            // Hover (stato)
            'card-shadow-info': (r === richiestaHover || r === richiestaSelezionata) && r.stato === StatoRichiesta.Assegnata,
            'card-shadow-success': (r === richiestaHover || r === richiestaSelezionata) && r.stato === StatoRichiesta.Presidiata,
            'card-shadow-danger': (r === richiestaHover || r === richiestaSelezionata) && r.stato === StatoRichiesta.Chiamata,
            'card-shadow-warning': (r === richiestaHover || r === richiestaSelezionata) && r.stato === StatoRichiesta.Sospesa,
            'card-shadow-secondary': (r === richiestaHover || r === richiestaSelezionata) && r.stato === StatoRichiesta.Chiusa,
            'bg-light': (r === richiestaSelezionata || r === richiestaHover) && r.stato !== StatoRichiesta.Chiusa,
            'bg-pattern-chiuso': r.stato === StatoRichiesta.Chiusa,
        };
        const cardBorder = this.cardBorder(r);
        return { ...classes, ...cardBorder };
    }

    /* NgClass Card Fissata Status */
    cardFissataClasses(r: SintesiRichiesta) {
        if (r) {
            const classes = {
                'card-shadow-info': r.stato === StatoRichiesta.Assegnata,
                'card-shadow-success': r.stato === StatoRichiesta.Presidiata,
                'card-shadow-danger': r.stato === StatoRichiesta.Chiamata,
                'card-shadow-warning': r.stato === StatoRichiesta.Sospesa,
                'card-shadow-secondary': r.stato === StatoRichiesta.Chiusa,
                'bg-pattern-chiuso': r.stato === StatoRichiesta.Chiusa,
            };
            const cardBorder = this.cardBorder(r);
            return { ...classes, ...cardBorder };
        }
    }

    cardBorder(r: SintesiRichiesta) {
        if (r) {
            if (!this._isInLavorazione(r.stato, r.listaUtentiInLavorazione)) {
                return {
                    // Bordo sinistro (stato)
                    'status_chiamata': r.stato === StatoRichiesta.Chiamata,
                    'status_presidiato': r.stato === StatoRichiesta.Presidiata,
                    'status_assegnato': r.stato === StatoRichiesta.Assegnata,
                    'status_sospeso': r.stato === StatoRichiesta.Sospesa,
                    'status_chiuso': r.stato === StatoRichiesta.Chiusa,
                };
            } else {
                return { 'status_in_lavorazione': true };
            }
        }
    }

    vettorePallini(richiesta) {
        return new Array(richiesta.priorita);
    }

    vettoreBuchini(richiesta) {
        const MAX_PRIORITA = 5;
        return new Array(MAX_PRIORITA - richiesta.priorita);
    }

    dettagliMezzo(stato, tipostato, classe) {
        return this.stato.getColor(stato, tipostato, classe);
    }


    _dateNumber(dateString: any) {
        return new Date(dateString).getTime();
    }

    _dateTime(dateString: any) {
        return new Date(dateString);
    }

    _terrenoMaggiore(tipoTerreno: TipoTerreno[]): TipoTerrenoMqHa {
        if (tipoTerreno && tipoTerreno.length > 0) {
            let value = 0;
            let string = '';
            tipoTerreno.forEach(result => {
                if (result.mq > value) {
                    string = TipoTerrenoEnum[result.descrizione];
                    value = result.mq;
                }
            });
            return { terrenoHa: `${string} (${round1decimal(value / 10000)} ha)`, terrenoMq: `${string} (${value} mq)` };
        } else {
            return null;
        }
    }

    _terreniMinori(tipoTerreno: TipoTerreno[]): TipoTerreno[] {
        if (tipoTerreno && tipoTerreno.length > 1) {
            let value = 0;
            tipoTerreno.forEach(terreno => {
                if (terreno.mq > value) {
                    value = terreno.mq;
                }
            });
            return tipoTerreno.filter(terreno => terreno.mq !== value);
        } else {
            return null;
        }
    }

    _tipoTerreno(tipoTerreno: TipoTerreno): string {
        if (tipoTerreno) {
            return `${TipoTerrenoEnum[tipoTerreno.descrizione]} (${tipoTerreno.mq} mq / ${round1decimal(tipoTerreno.mq / 10000)} ha)`;
        }
    }

    _entiCount(intervenuti?: number, presiInCarico?: number): string {
        if (intervenuti || presiInCarico) {
            const count = intervenuti + presiInCarico;
            return count === 1 ? '1 Ente' : `${count} Enti`;
        } else {
            return null;
        }
    }

    _isInLavorazione(stato: StatoRichiesta, attivita: AttivitaUtente[]): boolean {
        if (attivita && stato === StatoRichiesta.Chiamata) {
            for (const _attivita in attivita) {
                /**
                 * eventuale logica di controllo
                 */
                if (_attivita) {
                    return true;
                }
            }
        }
        return false;
    }

    _primoUtente(attivita: AttivitaUtente[]): AttivitaUtente {
        if (attivita) {
            return attivita[0];
        }
        return null;
    }

    _altriUtenti(attivita: AttivitaUtente[]): AttivitaUtente[] {
        if (attivita) {
            return attivita.slice(1);
        }
        return null;
    }

    _utenteTooltip(attivita: AttivitaUtente): string {
        if (attivita) {
            return `${attivita.nominativo} - ${attivita.dataInizioAttivita}`;
        }
        return null;
    }
}

export function round1decimal(value: number) {
    const decimal = value < 0.01 ? 1000 : 100;
    return Math.round(value * decimal) / decimal;
}
