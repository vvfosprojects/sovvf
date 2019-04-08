import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DownlineTreeviewItem, OrderDownlineTreeviewEventParser, TreeItem, TreeviewConfig, TreeviewEventParser, TreeviewItem } from 'ngx-treeview';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SediTreeviewState } from '../store/states/sedi-treeview/sedi-treeview.state';
import { ClearSediNavbarSelezionate, PatchSediNavbarSelezionate, SetSediNavbarSelezionate } from '../store/actions/sedi-treeview/sedi-treeview.actions';
import { isNil, reverse } from 'lodash';
import { arrayUnique } from '../../../shared/helper/function';
import { Ricorsivo } from '../store/states/sedi-treeview/sedi-treeview.helper';


@Component({
    selector: 'app-unita-operativa-treeview',
    templateUrl: './unita-operativa-treeview.component.html',
    styleUrls: ['./unita-operativa-treeview.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    ]
})
export class UnitaOperativaTreeviewComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    treeViewOpened: boolean;

    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

    @Select(SediTreeviewState.listeSediNavbar) listeSedi$: Observable<TreeItem>;
    items: TreeviewItem[];

    @Select(SediTreeviewState.sediNavbarTesto) sedeSelezionata$: Observable<string>;
    sedeSelezionata: string;

    @Select(SediTreeviewState.sediNavbarTastoConferma) tastoConferma$: Observable<boolean>;

    constructor(private store: Store, config: NgbDropdownConfig) {
        config.autoClose = false;

        this.subscription.add(
            this.listeSedi$.subscribe((listaSedi: TreeItem) => {
                this.items = [];
                this.items[0] = new TreeviewItem(listaSedi);
            })
        );

        this.subscription.add(this.sedeSelezionata$.subscribe(
            (sedeSelezionata: string) => {
                this.sedeSelezionata = sedeSelezionata;
            })
        );
    }

    @ViewChild('treeviewSedi') treeviewSedi: NgbDropdown;

    @HostListener('document:keydown.escape') onKeydownHandler() {
        if (this.treeViewOpened) {
            this.store.dispatch(new ClearSediNavbarSelezionate());
            this.treeviewSedi.close();
        }
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    openDropDown(value: any) {
        this.treeViewOpened = !!value;
    }

    onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
        const leaves = [];
        let parents = [];
        const firstParent = [];
        /**
         * controllo se ho selezionato tutta la lista
         */
        downlineItems.forEach(downlineItem => {
            let _parent = downlineItem.parent;
            while (!isNil(_parent)) {
                if (_parent.item['internalChecked']) {
                    if (!_parent.parent) {
                        if (!firstParent.includes(_parent.item.value)) {
                            firstParent.push(_parent.item.value);
                        }
                    }
                }
                _parent = _parent.parent;
            }
        });
        /**
         * vedo quali padri e foglie sono selezionate
         */
        if (firstParent.length === 0) {
            downlineItems.forEach(downlineItem => {
                const item = downlineItem.item;
                const value = item.value;
                const texts = [item.text];
                let parentNode = downlineItem.parent;
                /**
                 * ciclo tutti i nodi controllando che il padre sia selezionato
                 */
                while (!isNil(parentNode.item['internalChecked'])) {
                    texts.push(`${parentNode.item.text}::${parentNode.item.value}`);
                    parentNode = parentNode.parent;
                }
                const reverseTexts = reverse(texts);
                const row = `${reverseTexts.join('->')}::${value}`;
                /**
                 * creo delle stringhe con il formato padre::id_padre->figlio::id_figlio->etc...
                 */
                if (row.indexOf('->') < 0) {
                    /**
                     * se non trovo '->' sono foglie senza padre selezionato
                     */
                    leaves.push(row.split('::')[1]);
                } else {
                    /**
                     * sono i padri che mi interessano
                     */
                    parents.push(row.substring(0, row.indexOf('->')).split('::')[1]);
                }
            });
        } else {
            /**
             * se è selezionato il primo padre (nodo principale) lo assegno ai parents direttamente
             */
            parents = firstParent;
        }
        /**
         * cancello tutti i genitori duplicati
         */
        const parent = arrayUnique(parents);
        /**
         * verifico che non ci siano più padri (con genitori diversi) o più foglie
         */
        const unique = [];
        if ((leaves.length > 0 && parent.length > 0) || leaves.length > 1 || parent.length > 1) {
            console.log(`più sedi selezionate: ${[...parent, ...leaves]}`);
            this.store.dispatch(new PatchSediNavbarSelezionate([...parent, ...leaves], Ricorsivo.NonRicorsivo));
        } else {
            unique[0] = parent.length === 1 ? parent[0] : leaves[0];
            if (unique) {
                console.log(`una sede selezionata: ${unique[0]}`);
                this.store.dispatch(new PatchSediNavbarSelezionate([...unique], Ricorsivo.Ricorsivo));
            } else {
                console.log(`nessuna sede selezionata`);
                this.store.dispatch(new PatchSediNavbarSelezionate([]));
            }
        }
    }


    annulla() {
        this.store.dispatch(new ClearSediNavbarSelezionate());
    }

    conferma() {
        this.store.dispatch(new SetSediNavbarSelezionate());
    }

}
