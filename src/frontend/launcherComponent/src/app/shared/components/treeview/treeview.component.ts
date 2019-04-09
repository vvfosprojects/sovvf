import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DownlineTreeviewItem, OrderDownlineTreeviewEventParser, TreeviewConfig, TreeviewEventParser, TreeviewItem } from 'ngx-treeview';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { arrayUnique } from '../../helper/function';
import { Ricorsivo } from '../../../features/navbar/store/states/sedi-treeview/sedi-treeview.helper';
import { isNil, reverse } from 'lodash';
import { TreeviewEmitterInterface } from './treeview-emitter.interface';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-shared-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    ]
})
export class TreeviewComponent implements OnInit {
    treeViewOpened: boolean;

    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

    @Input() items: TreeviewItem[];
    @Input() sedeSelezionata: Observable<string>;
    @Input() tastoConferma: boolean;
    @Output() clearSelezione = new EventEmitter<any>();
    @Output() confermaSelezione = new EventEmitter<any>();
    @Output() patchSelezione = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.autoClose = false;
    }

    @ViewChild('treeviewSedi') treeviewSedi: NgbDropdown;

    @HostListener('document:keydown.escape') onKeydownHandler() {
        if (this.treeViewOpened) {
            this.clearSelezione.emit();
            this.treeviewSedi.close();
        }
    }

    ngOnInit() {
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
            this.patch([...parent, ...leaves], Ricorsivo.NonRicorsivo);
        } else {
            unique[0] = parent.length === 1 ? parent[0] : leaves[0];
            if (unique) {
                console.log(`una sede selezionata: ${unique[0]}`);
                this.patch([...unique], Ricorsivo.Ricorsivo);
            } else {
                console.log(`nessuna sede selezionata`);
                this.patch([]);
            }
        }
    }

    annulla() {
        this.clearSelezione.emit();
    }

    conferma() {
        this.confermaSelezione.emit();
    }

    patch(idS: string[], ricorsivo?: Ricorsivo) {
        const eventEmitter: TreeviewEmitterInterface = {
            idSelezionati: idS,
            ricorsivo: ricorsivo
        };
        this.patchSelezione.emit(eventEmitter);
    }

}
