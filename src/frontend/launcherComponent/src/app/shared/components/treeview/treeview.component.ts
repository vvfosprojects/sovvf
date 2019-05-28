import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges, OnDestroy, OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { DownlineTreeviewItem, OrderDownlineTreeviewEventParser, TreeviewConfig, TreeviewEventParser, TreeviewItem } from 'ngx-treeview';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { arrayUnique } from '../../helper/function';
import { isNil, reverse } from 'lodash';
import { Ricorsivo, TreeviewEmitterInterface } from '../../interface/treeview.interface';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { sedeString } from '../../store/states/sedi-treeview/sedi-treeview.helper';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-shared-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.css'],
    encapsulation: ViewEncapsulation.Emulated,
    providers: [
        { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    ]
})
export class TreeviewComponent implements OnChanges, OnDestroy, OnInit {
    treeViewOpened: boolean;

    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

    treeViewSelection: TreeviewSelezione[];
    tastoConferma: boolean;

    @Input() colorButton = 'btn-default';
    @Input() items: TreeviewItem[];
    @Input() testoSedeSelezionata$: Observable<string>;
    @Input() tastoConferma$: Observable<boolean>;
    @Input() testoSedeSelezionata: string;
    @Input() visualizzaTasti = false;
    @Input() placement: string;
    @Output() annullaSelezione = new EventEmitter();
    @Output() confermaSelezione = new EventEmitter<TreeviewSelezione[]>();
    @Output() patchSelezione = new EventEmitter<TreeviewEmitterInterface>();

    constructor(config: NgbDropdownConfig) {
        config.autoClose = 'outside';
    }

    @ViewChild('treeviewSedi') treeviewSedi: NgbDropdown;

    @HostListener('document:keydown.escape') onKeydownHandler() {
        if (this.treeViewOpened) {
            this.annullaSelezione.emit();
            this.treeviewSedi.close();
        }
    }

    ngOnInit(): void {
        console.log(`Componente Shared Treeview creato`);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const testoSedeSelezionata$ = changes.testoSedeSelezionata$;
        const testoSedeSelezionata = changes.testoSedeSelezionata;
        const tastoConferma$ = changes.tastoConferma$;
        if (testoSedeSelezionata$) {
            testoSedeSelezionata$.currentValue.subscribe( result => this.testoSedeSelezionata = sedeString(result));
        } else if (testoSedeSelezionata) {
            this.testoSedeSelezionata = sedeString(testoSedeSelezionata.currentValue);
        }
        if (tastoConferma$) {
            tastoConferma$.currentValue.subscribe( result => this.tastoConferma = result);
        }
    }

    ngOnDestroy(): void {
        console.log(`Componente Shared Treeview distrutto`);
    }

    openDropDown(value: any): void {
        this.treeViewOpened = !!value;
    }

    onSelectedChange(downlineItems: DownlineTreeviewItem[]): void {
        this.treeViewSelection = [];
        const leaves = [];
        let duplicateParents = [];
        const firstParent = [];
        let eventEmitter: TreeviewEmitterInterface;
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
                    const leav = row.split('::')[1];
                    leaves.push(leav);
                    this.treeViewSelection.push(new TreeviewSelezione(leav, Ricorsivo.NonRicorsivo));
                } else {
                    /**
                     * sono i padri che mi interessano
                     */
                    duplicateParents.push(row.substring(0, row.indexOf('->')).split('::')[1]);
                }
            });
        } else {
            /**
             * se è selezionato il primo padre (nodo principale) lo assegno ai duplicateParents direttamente
             */
            duplicateParents = firstParent;
        }
        /**
         * cancello tutti i genitori duplicati
         */
        const parents = arrayUnique(duplicateParents);
        parents.forEach(parent => {
            this.treeViewSelection.push(new TreeviewSelezione(parent, Ricorsivo.Ricorsivo));
        });
        /**
         * verifico che non ci siano più padri (con genitori diversi) o più foglie
         */
        const unique = [];
        if ((leaves.length > 0 && parents.length > 0) || leaves.length > 1 || parents.length > 1) {
            eventEmitter = {
                idSelezionati: [...parents, ...leaves],
                multi: true,
                log: `più sedi selezionate: ${[...parents, ...leaves]}`
            };
        } else {
            unique[0] = parents.length === 1 ? parents[0] : leaves[0];
            if (unique[0]) {
                eventEmitter = {
                    idSelezionati: [...unique],
                    multi: false,
                    log: `una sede selezionata: ${unique[0]}`
                };
            } else {
                eventEmitter = {
                    idSelezionati: [],
                    multi: false,
                    log: `nessuna sede selezionata`
                };
            }
        }
        if (this.visualizzaTasti) {
            // console.log(eventEmitter);
            this.patch(eventEmitter);
        } else {
            this.conferma();
        }
        // console.log(this.treeViewSelection);
    }

    annulla(): void {
        this.annullaSelezione.emit();
    }

    conferma(): void {
        this.confermaSelezione.emit(this.treeViewSelection);
    }

    patch(eventEmitter: TreeviewEmitterInterface): void {
        this.patchSelezione.emit(eventEmitter);
    }

}
