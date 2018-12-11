import { Injectable, OnDestroy } from '@angular/core';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { Observable, of, Subscription } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { UnitaOperativaService } from '../unita-operativa-service/unita-operativa.service';
import { UnitaAttualeService } from '../unita-attuale/unita-attuale.service';
import { GetSediSelezionateTreeView } from './_get-sedi-selezionate-treeview';
import { AbbreviaSedi } from './_abbrevia-sedi';
import { LivelliSedi } from './treeview.interface';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaTreeviewService implements OnDestroy {

    private subscription = new Subscription();
    private unitaOperative: Sede[];
    private unitaAttuale: string[] = [];
    private treeViewSedi;
    private _truncate: any;
    _get: any;

    /**
     * inserire qui la "configurazione" dei livelli del treeview di sedi
     */
    private livelli: LivelliSedi = {
        primo: ['direzione'],
        secondo: ['comando'],
        terzo: ['distaccamento']
    };

    constructor(private unitaOperativaS: UnitaOperativaService,
                private unitaAttualeS: UnitaAttualeService) {
        this._truncate = new AbbreviaSedi();
        this.unitaAttualeS.livelli = this.livelli;
        this.unitaOperativaS.getUnitaOperative().subscribe(unitaOperative => {
            this.unitaOperative = unitaOperative;
            this.unitaAttualeS.unitaOC = unitaOperative;
            this._get = new GetSediSelezionateTreeView(unitaOperative, this.createSediTreeItem());
        });
        this.subscription.add(
            this.unitaAttualeS.getUnitaOperativaAttuale().subscribe(unitaAttuale => {
                const sedi: string[] = [];
                unitaAttuale.forEach(a => {
                    sedi.push(a.codice);
                });
                this.unitaAttuale = sedi;
                this.treeViewSedi = this.createSediTreeItem();
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getSediAttualiString(): string {
        return this._truncate.sedeString(this._get.sediSelezionate(this.unitaAttuale).testo);
    }

    createSediTreeItem(): TreeItem {
        let countR = 0;
        const self = this.livelli;
        /**
         * array di stringhe di id delle sedi attuali attive
         * @type {string[]}
         */
        const attuale = this.unitaAttuale;

        /**
         * array di oggetti di tutte le sedi esistenti
         * @type {Sede[]}
         */
        const unitaOperative = this.unitaOperative;


        /**
         * creo l'array di oggetti TreeItem direzioni con dentro tutte le sedi e i distaccamenti
         */
        const direzioni: TreeItem[] = [];
        unitaOperative.forEach(r => {
            if (!r.provincia && self.primo.includes(r.tipo.toLowerCase())) {
                direzioni.push({
                    text: r.descrizione,
                    value: r.codice,
                    collapsed: getComandi(r.regione).collapsed,
                    checked: attuale.includes(r.codice),
                    children: getComandi(r.regione).comandi
                });
                if (getComandi(r.regione).allChecked || !getComandi(r.regione).collapsed) {
                    countR += 1;
                } else {
                    countR += attuale.includes(r.codice) ? 1 : 0;
                }
            }
        });

        /**
         * funzione che ritorna i comandi di una regione, e ritorna true se c'è almeno un comando presente
         * @param {string} value
         * @returns {{comandi: TreeItem[]; checkC: boolean}}
         */
        function getComandi(value: string): { comandi: TreeItem[]; collapsed: boolean; allChecked: boolean } {
            const comandi: TreeItem[] = [];
            let countC = 0;
            let countCollapsed = 0;
            unitaOperative.forEach(c => {
                if (self.secondo.includes(c.tipo.toLowerCase()) && c.regione === value) {
                    comandi.push({
                        text: c.descrizione,
                        value: c.codice,
                        collapsed: getDistaccamenti(c.provincia).collapsed,
                        checked: attuale.includes(c.codice),
                        children: getDistaccamenti(c.provincia).distaccamenti
                    });
                    countCollapsed += !getDistaccamenti(c.provincia).collapsed ? 1 : 0;
                    if (getDistaccamenti(c.provincia).allChecked || !getDistaccamenti(c.provincia).collapsed) {
                        countC += 1;
                    } else {
                        countC += attuale.includes(c.codice) ? 1 : 0;
                    }
                }
            });
            const allChecked = (comandi.length === countC);
            let collapsed = (countC === 0 || countC > 0 && allChecked);
            if (countCollapsed !== 0) {
                collapsed = false;
            }
            return {
                comandi: comandi,
                collapsed: collapsed,
                allChecked: allChecked
            };
        }

        /**
         * funzione che ritorna i distaccamenti di una provincia, e ritorna true se c'è almeno un distaccamento presente
         * @param {string} value
         * @returns {{distaccamenti: TreeItem[]; checkedD: boolean}}
         */
        function getDistaccamenti(value: string): { distaccamenti: TreeItem[]; collapsed: boolean; allChecked: boolean } {
            const distaccamenti: TreeItem[] = [];
            let countD = 0;
            unitaOperative.forEach(d => {
                if (self.terzo.includes(d.tipo.toLowerCase()) && d.provincia === value) {
                    distaccamenti.push({
                        text: d.descrizione,
                        value: d.codice,
                        checked: attuale.includes(d.codice)
                    });
                    countD += attuale.includes(d.codice) ? 1 : 0;
                }
            });
            const allChecked = (distaccamenti.length === countD);
            return {
                distaccamenti: distaccamenti,
                collapsed: (countD === 0 || countD > 0 && allChecked),
                allChecked: allChecked
            };
        }
        /**
         * ritorno l'oggetto CON completo di tipo TreeItem
         * @type {TreeItem[]}
         */
        return { text: 'CON', value: '0', collapsed: (countR === 0), children: direzioni };
    }

    /**
     * metodo che ritorna un observable di tipo TreeviewItem con l'array di oggetti TreeItem, ritornato dal metodo createSediTreeItem()
     * @returns {Observable<TreeviewItem[]>}
     */
    getSedi(): Observable<TreeviewItem[]> {
        return of([new TreeviewItem(this.treeViewSedi)]);
    }

}
