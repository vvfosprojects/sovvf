import {Sede} from '../../../shared/model/sede.model';
import {TreeItem} from 'ngx-treeview';

export class GetSediSelezionateTreeView {
    constructor(private unitaOperative: Sede[], private sediTreeView: TreeItem) {
    }

    /**
     *
     * @param {string[]} value
     * @returns {ChildCON}
     */
    sediSelezionate(value: string[]): ChildCON {
        const sediTreeView = this.sediTreeView;
        const unitaOperative = this.unitaOperative;
        const sediSelezionateLivelli: Sede[] = [];
        let countSPrimi = 0;
        let messageSedi = 'nessuna sede selezionata';
        let sediDifferenti = 0;
        let sediOrfane1 = 0;
        let sediOrfane2 = 0;
        let messaggioPrimoLivello = null;
        sediTreeView.children.forEach(primo => {
            countSPrimi += primoLivello(primo).allChecked ? 1 : 0;
            primoLivello(primo).sedi.forEach(sediPrimoLivello => {
                sediSelezionateLivelli.push(sediPrimoLivello);
            });
            // console.log(primoLivello(primo));
            if (primoLivello(primo).message) {
                messaggioPrimoLivello = primoLivello(primo).message;
            }
            if (!primoLivello(primo).message) {
                sediOrfane1 += !primoLivello(primo).allChecked && primoLivello(primo).padriSecondoLivello.length > 0 ? 1 : 0;
            }
            sediOrfane2 += primoLivello(primo).sediOrfano;
            sediDifferenti += primoLivello(primo).sedi.length > 0 ? 1 : 0;
        });

        function getSede(codiceSede: string): Sede {
            return unitaOperative.find(obj => obj.codice === codiceSede);
        }

        /**
         *
         * @param primo
         * @returns {{allChecked: boolean; sedi: Sede[]; sediOrfano: number; padrePrimoLivello: Sede; padriSecondoLivello: Sede[]; message: any}}
         */
        function primoLivello(primo) {
            const secondoFigli = primo.children.length;
            const sediSelezionate: Sede[] = [];
            let countSSecondi = 0;
            let allChecked = false;
            let sedePrimoPadre: Sede = null;
            let messagePrimoLivello = null;
            let sediOrfano = 0;
            const sedeSecondoPadri: Sede[] = [];
            primo.children.forEach(secondo => {
                countSSecondi += secondoLivello(secondo).countSecondi;
                secondoLivello(secondo).sedi.forEach(sediSecondoLivello => {
                    sediSelezionate.push(sediSecondoLivello);
                    const sedePadreSecondo = secondoLivello(secondo).sedePadre;
                    if (sedePadreSecondo && !sedeSecondoPadri.includes(sedePadreSecondo)) {
                        sedeSecondoPadri.push(secondoLivello(secondo).sedePadre);
                    }
                });
                sediOrfano += secondoLivello(secondo).countSecondi === 0 && secondoLivello(secondo).sedi.length > 0 ? 1 : 0;
            });

            if (secondoFigli === countSSecondi) {
                sedePrimoPadre = getSede(primo.value);
                sediSelezionate.push(sedePrimoPadre);
                allChecked = true;
            }

            if (sedeSecondoPadri.length === 1 && sediOrfano === 0) {
                messagePrimoLivello = sedeSecondoPadri[0].descrizione;
            } else if (allChecked) {
                messagePrimoLivello = sedePrimoPadre.descrizione;
            }

            return {
                allChecked: allChecked,
                sedi: sediSelezionate,
                sediOrfano: sediOrfano,
                padrePrimoLivello: sedePrimoPadre,
                padriSecondoLivello: sedeSecondoPadri,
                message: messagePrimoLivello
            };
        }

        /**
         *
         * @param secondo
         * @returns {{countSecondi: number; allChecked: boolean; sedi: Sede[]; sedePadre: Sede}}
         */
        function secondoLivello(secondo) {
            const terzoFigli = secondo.children.length;
            const sediSelezionate: Sede[] = [];
            let countSSecondi = 0;
            let countSTerzi = 0;
            let allChecked = false;
            let sedePadre: Sede = null;
            secondo.children.forEach(terzo => {
                if (value.includes(terzo.value)) {
                    countSTerzi += 1;
                    sediSelezionate.push(getSede(terzo.value));
                    if (terzoFigli === countSTerzi) {
                        sedePadre = getSede(secondo.value);
                        sediSelezionate.push(sedePadre);
                        countSSecondi += 1;
                        allChecked = true;
                    }
                }
            });

            return {
                countSecondi: countSSecondi,
                allChecked: allChecked,
                sedi: sediSelezionate,
                sedePadre: sedePadre
            };
        }

        /**
         * ritorna true se è tutto selezionato
         */
        const checkTotal = (countSPrimi === sediTreeView.children.length);
        if (value.length > 0) {
            if ((value.length > 1 && sediOrfane1 > 0) || (value.length > 1 && sediOrfane2 > 0) || sediDifferenti > 1) {
                messageSedi = 'più sedi selezionate';
            } else if (value.length === 1 && sediOrfane2 === 1) {
                messageSedi = getSede(value[0]).descrizione;
            } else {
                messageSedi = messaggioPrimoLivello;
            }
        }

        const message = checkTotal ? 'CON' : messageSedi;

        return {
            testo: message,
            sedi: sediSelezionateLivelli,
            error: value.length === 0,
            allChecked: checkTotal
        };

    }

}

export interface ChildCON {
    testo: string;
    sedi: Sede[];
    error: boolean;
    allChecked: boolean;
}
