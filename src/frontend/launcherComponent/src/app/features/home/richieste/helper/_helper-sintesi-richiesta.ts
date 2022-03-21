import { Priorita, SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { Partenza } from '../../../../shared/model/partenza.model';
import { Squadra } from '../../../../shared/model/squadra.model';
import { ColoriStatoMezzo } from '../../../../shared/helper/_colori';
import { TipoTerrenoEnum } from '../../../../shared/enum/tipo-terreno.enum';
import { TipoTerreno } from '../../../../shared/model/tipo-terreno';
import { TipoTerrenoMqHa } from '../../../../shared/interface/tipo-terreno-mq-ha';
import { AttivitaUtente } from 'src/app/shared/model/attivita-utente.model';
import { round1decimal } from '../../../../shared/helper/function-generiche';
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { Sede } from '../../../../shared/model/sede.model';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { EnteInterface } from '../../../../shared/interface/ente.interface';

export class HelperSintesiRichiesta {

    stato = new ColoriStatoMezzo();

    /**
     * restituisce le squadre realmente impegnate in una partenza
     * @param: richiesta
     */
    getSquadre(richiesta: SintesiRichiesta): Squadra[] {
        const squadre = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((p: Partenza) => {
                if (p.partenza && p.partenza.squadre && !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata) {
                    p.partenza.squadre.forEach((squadra: Squadra) => {
                        squadre.push(squadra);
                    });
                }
            });
        }
        return squadre;
    }


    /* Restituisce il mezzo */
    mezziRichiesta(richiesta: SintesiRichiesta): Mezzo[] {
        const mezzi = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((p: Partenza) => {
                if (p.partenza && p.partenza.mezzo && !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata) {
                    mezzi.push(p.partenza.mezzo);
                }
            });
        }
        return mezzi;
    }

    /* Restituisce i nomi dei mezzi  */
    nomiMezzi(richiesta: SintesiRichiesta): string[] {
        const nomiMezzi = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((p: Partenza) => {
                if (p.partenza && p.partenza.mezzo && !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata) {
                    nomiMezzi.push(p.partenza.mezzo.codice);
                }
            });
        }
        return nomiMezzi;
    }

    /* Restituisce la descrizione dei mezzi */
    descscrizioneMezzi(richiesta: SintesiRichiesta): string[] {
        const nomiMezzi = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach((p: Partenza) => {
                if (p.partenza && p.partenza.mezzo && !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata) {
                    nomiMezzi.push(p.partenza.mezzo.descrizione);
                }
            });
        }
        return nomiMezzi;
    }

    /* Restituisce il numero dei mezzi */
    numeroMezzi(richiesta: SintesiRichiesta): number {
        let numeroMezzi = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach((p: Partenza) => {
                if (p.partenza && p.partenza.mezzo && !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata && p.partenza.mezzo.stato !== 'In Rientro') {
                    numeroMezzi++;
                }
            });
        }
        return numeroMezzi;
    }

    /* Restituisce il numero dei mezzi in rientro */
    numeroMezziInRientro(richiesta: SintesiRichiesta): number {
        let numeroMezzi = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach((p: Partenza) => {
                if (p.partenza && p.partenza.mezzo.stato === 'In Rientro' && !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata) {
                    numeroMezzi++;
                }
            });
        }
        return numeroMezzi;
    }

    /* Permette di colorare l'icona della tipologia */
    coloraIcona(tipologia: Tipologia): string {
        if (!tipologia) {
            return 'fas fa-exclamation-triangle text-warning';
        }
        const nome = tipologia.icona;
        if (nome) {
            const colori = [
                {
                    icon: 'fas fa-fire',
                    color: 'text-danger'
                },
                {
                    icon: 'fas fa-exclamation-triangle',
                    color: 'text-warning'
                },
                {
                    icon: 'fas fa-medkit',
                    color: 'text-primary'
                }
            ];

            const colore = nome ? colori.find(x => x.icon === nome) : undefined;
            if (!nome || nome === '') {
                return 'fas fa-exclamation-triangle text-warning';
            } else if (colore !== undefined) {
                return nome + ' ' + colore.color;
            } else {
                return nome + ' guida';
            }
        } else {
            return 'fas fa-exclamation-triangle text-warning';
        }
    }

    /* Ritorna true se le parole matchano almeno in parte */
    match(word1: string, word2: string, substr: number): boolean {
        const word1San = word1.toLowerCase().substr(0, word1.length - substr);
        const word2San = word2.toLowerCase().substr(0, word2.length - substr);
        if (word1San === word2San) {
            return true;
        }
    }

    toggleGestioneClass(gestione: boolean): string {
        let returnClass: string;
        if (!gestione) {
            returnClass = 'fa-long-arrow-alt-down text-secondary';
        } else {
            returnClass = 'fa-long-arrow-alt-up text-success';
        }
        return returnClass;
    }

    complessitaClass(richiesta: any): any {
        if (richiesta.complessita) {
            return {
                'badge-mod-success': this.match(richiesta.complessita.descrizione, 'bassa', 1),
                'badge-mod-warning': this.match(richiesta.complessita.descrizione, 'media', 1),
                'badge-mod-danger': this.match(richiesta.complessita.descrizione, 'alta', 1)
            };
        }
    }

    /* NgClass Card Status */
    cardClasses(r: SintesiRichiesta, richiestaSelezionata: string, richiestaHover: string): any {
        if (r && r.id) {
            const classes = {
                // Hover (stato)
                // 'card-shadow-info': (r.id === richiestaHover || r.id === richiestaSelezionata) && r.stato === StatoRichiesta.Assegnata,
                'card-shadow-success': (r.id === richiestaHover || r.id === richiestaSelezionata) && r.stato === StatoRichiesta.Presidiata,
                'card-shadow-danger': (r.id === richiestaHover || r.id === richiestaSelezionata) && r.stato === StatoRichiesta.Chiamata,
                'card-shadow-warning': ((r.id === richiestaHover || r.id === richiestaSelezionata)) && (r.stato === StatoRichiesta.Assegnata || r.stato === StatoRichiesta.Sospesa),
                'card-shadow-secondary': (r.id === richiestaHover || r.id === richiestaSelezionata) && r.stato === StatoRichiesta.Chiusa,
                '': (r.id === richiestaSelezionata || r.id === richiestaHover) && r.stato !== StatoRichiesta.Chiusa,
                'bg-pattern-chiuso': r.stato === StatoRichiesta.Chiusa,
            };
            const cardBorder = this.cardBorder(r);
            return { ...classes, ...cardBorder };
        }
    }

// 1px solid #dc3545
    /* NgClass Card Fissata Status */
    cardFissataClasses(r: SintesiRichiesta): any {
        if (r) {
            const classes = {
                'card-shadow-warning': r.stato === StatoRichiesta.Assegnata || r.stato === StatoRichiesta.Sospesa,
                'card-shadow-success': r.stato === StatoRichiesta.Presidiata,
                'card-shadow-danger': r.stato === StatoRichiesta.Chiamata,
                'card-shadow-secondary': r.stato === StatoRichiesta.Chiusa,
                'bg-pattern-chiuso': r.stato === StatoRichiesta.Chiusa,
            };
            const cardBorder = this.cardBorder(r);
            return { ...classes, ...cardBorder };
        }
    }

    cardBorder(r: SintesiRichiesta): any {
        if (r) {
            return {
                status_chiamata: r.stato === StatoRichiesta.Chiamata,
                status_presidiato: r.stato === StatoRichiesta.Presidiata,
                status_assegnato: r.stato === StatoRichiesta.Assegnata,
                status_sospeso: r.stato === StatoRichiesta.Sospesa,
                status_chiuso: r.stato === StatoRichiesta.Chiusa,
            };
        }
    }

    vettorePallini(richiesta): Priorita[] {
        return new Array(richiesta.priorita);
    }

    vettoreBuchini(richiesta): string[] {
        const MAX_PRIORITA = 5;
        return new Array(MAX_PRIORITA - richiesta.priorita);
    }

    dettagliMezzo(stato, tipostato, classe): string {
        return this.stato.getColor(stato, tipostato, classe);
    }


    _dateNumber(dateString: any): number {
        return new Date(dateString).getTime();
    }

    _dateTime(dateString: any): Date {
        return new Date(dateString);
    }

    _terrenoMaggiore(tipoTerreno: TipoTerreno[]): TipoTerrenoMqHa {
        if (tipoTerreno && tipoTerreno.length > 0) {
            let value = 0;
            let terrenoString = '';
            tipoTerreno.forEach(result => {
                if (result.ha > value) {
                    terrenoString = TipoTerrenoEnum[result.descrizione];
                    value = result.ha;
                }
            });
            return { terrenoHa: `${terrenoString} (${value} ha)`, terrenoMq: `${terrenoString} (${round1decimal(value * 10000)} mq)` };
        } else {
            return null;
        }
    }

    _terreniMinori(tipoTerreno: TipoTerreno[]): TipoTerreno[] {
        if (tipoTerreno && tipoTerreno.length > 1) {
            return tipoTerreno.filter(terreno => terreno.ha > 0);
        } else {
            return null;
        }
    }

    _tipoTerreno(tipoTerreno: TipoTerreno): string {
        if (tipoTerreno) {
            return `${TipoTerrenoEnum[tipoTerreno.descrizione]} (${round1decimal(tipoTerreno.ha * 10000)} mq / ${tipoTerreno.ha} ha)`;
        }
    }

    _getEntiByCod(listEnti: EnteInterface[], codEnti: number[]): EnteInterface[] {
        if (listEnti?.length && codEnti?.length) {
            const enti = [];
            codEnti.forEach((codEnte: number) => {
                listEnti.forEach((e: EnteInterface) => {
                    if (e.codice === codEnte) {
                        enti.push(e);
                    }
                });
            });
            return enti;
        } else {
            return null;
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

    _isPresaInCarico(stato: StatoRichiesta, attivita: AttivitaUtente[]): boolean {
        if (attivita && stato === StatoRichiesta.Chiamata) {
            for (const a in attivita) {
                /**
                 * eventuale logica di controllo
                 */
                if (a) {
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

    _primaSedeAllertata(sediAllertate: Sede[]): string {
        if (sediAllertate && sediAllertate[0]) {
            return sediAllertate[0].descrizione;
        }
        return null;
    }

    _altreSediAllertate(sediAllertate: Sede[]): string[] {
        if (sediAllertate) {
            return sediAllertate.slice(1).map((s: Sede) => s.descrizione);
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
