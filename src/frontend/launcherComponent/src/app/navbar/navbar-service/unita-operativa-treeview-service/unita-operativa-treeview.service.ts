import { Injectable, OnDestroy } from '@angular/core';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { Observable, of, Subscription } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { UnitaOperativaService } from '../unita-operativa-service/unita-operativa.service';
import { UnitaAttualeService } from '../unita-attuale/unita-attuale.service';
import { GetTextSedi } from './_get-text-sedi';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaTreeviewService implements OnDestroy {

    private subscription = new Subscription();
    private unitaOperative: Sede[];
    private unitaAttuale: string[] = [];
    private treeViewSedi;
    _get: any;

    constructor(private unitaOperativaS: UnitaOperativaService,
                private unitaAttualeS: UnitaAttualeService) {
        this.unitaOperativaS.getUnitaOperative().subscribe(unitaOperative => {
            this.unitaOperative = unitaOperative;
            this._get = new GetTextSedi(unitaOperative);
        });
        this.subscription.add(
            this.unitaAttualeS.getUnitaOperativaAttuale().subscribe(unitaAttuale => {
                unitaAttuale.forEach(a => {
                    this.unitaAttuale.push(a.codice);
                });
                this.treeViewSedi = this.createSediTreeItem();
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    createSediTreeItem(): TreeItem {

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
         * creo l'oggetto CON come costante che rappresenta l'insieme di tutte le sedi
         */
        const CON = {text: 'CON', value: '0', collapsed: false, children: []};

        /**
         * creo l'array di oggetti TreeItem direzioni con dentro tutte le sedi e i distaccamenti
         */
        const direzioni: TreeItem[] = [];
        unitaOperative.forEach(r => {
            if (!r.provincia && r.tipo === 'Direzione') {
                direzioni.push({
                    text: r.descrizione,
                    value: r.codice,
                    collapsed: !getComandi(r.regione).checkC,
                    checked: attuale.includes(r.codice),
                    children: getComandi(r.regione).comandi
                });
            }
        });

        /**
         * funzione che ritorna i comandi di una regione, e ritorna true se c'è almeno un comandi presente
         * @param {string} value
         * @returns {{comandi: TreeItem[]; checkC: boolean}}
         */
        function getComandi(value: string): { comandi: TreeItem[]; checkC: boolean } {
            const comandi: TreeItem[] = [];
            let count = 0;
            let checked: boolean;
            unitaOperative.forEach(c => {
                if (c.tipo === 'Comando' && c.regione === value) {
                    comandi.push({
                        text: c.descrizione,
                        value: c.codice,
                        collapsed: !getDistaccamenti(c.provincia).checkD,
                        checked: attuale.includes(c.codice),
                        children: getDistaccamenti(c.provincia).distaccamenti
                    });
                    count++;
                }
            });
            count > 0 ? checked = true : checked = false;
            return {
                comandi: comandi,
                checkC: checked
            };
        }

        /**
         * funzione che ritorna i distaccamenti di una provincia, e ritorna true se c'è almeno un distaccamento presente
         * @param {string} value
         * @returns {{distaccamenti: TreeItem[]; checkedD: boolean}}
         */
        function getDistaccamenti(value: string): { distaccamenti: TreeItem[]; checkD: boolean } {
            const distaccamenti: TreeItem[] = [];
            let count = 0;
            let checked: boolean;
            unitaOperative.forEach(d => {
                if (d.tipo === 'Distaccamento' && d.provincia === value) {
                    distaccamenti.push({
                        text: d.descrizione,
                        value: d.codice,
                        checked: attuale.includes(d.codice)
                    });
                    count++;
                }
            });
            count > 0 ? checked = true : checked = false;
            return {
                distaccamenti: distaccamenti,
                checkD: checked
            };
        }

        /**
         * ritorno l'oggetto CON completo di tipo TreeItem
         * @type {TreeItem[]}
         */
        CON.children = direzioni;
        return CON;
    }

    /**
     * metodo che ritorna un observable di tipo TreeviewItem con l'array di oggetti TreeItem, ritornato dal metodo createSediTreeItem()
     * @returns {Observable<TreeviewItem[]>}
     */
    getSedi(): Observable<TreeviewItem[]> {
        return of([new TreeviewItem(this.treeViewSedi)]);
    }

}
