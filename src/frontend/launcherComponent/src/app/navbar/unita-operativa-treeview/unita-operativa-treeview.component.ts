import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {UnitaOperativaTreeviewService} from '../navbar-service/unita-operativa-treeview-service/unita-operativa-treeview.service';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {CambioSedeModalNavComponent} from '../cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import {UnitaAttualeService} from '../navbar-service/unita-attuale/unita-attuale.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {Sede} from '../../shared/model/sede.model';
import {Coordinate} from '../../shared/model/coordinate.model';


@Component({
    selector: 'app-unita-operativa-treeview',
    templateUrl: './unita-operativa-treeview.component.html',
    styleUrls: ['./unita-operativa-treeview.component.css']
})
export class UnitaOperativaTreeviewComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    unitaAttuale: Sede[];

    items: TreeviewItem[];
    initItem: any[];
    selectedItem: any[];
    checkedCount = 0;
    sedeCorrenteString: string;

    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

    constructor(private treeviewService: UnitaOperativaTreeviewService,
                private unitaAttualeS: UnitaAttualeService,
                private _modalService: NgbModal) {
        this.unitaAttuale = this.unitaAttualeS.unitaSelezionata;
        this.subscription.add(
            this.unitaAttualeS.getUnitaOperativaAttuale().subscribe(unitaAttuale => {
                this.unitaAttuale = unitaAttuale;
                if (this.unitaAttuale.length > 0) {
                    this.sedeCorrenteString = this.treeviewService.getSediAttualiString();
                }
                this.checkedCount = 0;
            })
        );
        this.subscription.add(
            this.unitaAttualeS.getAnnullaTreeView().subscribe(statoTreeView => {
                if (statoTreeView) {
                    this.annullaCambioSede();
                }
            })
        );

        const sedeAttuale = [
            new Sede('1', 'Comando di Roma', new Coordinate(41.899940, 12.491270), 'Via Genova, 1, 00184 Roma RM', 'Comando', 'Lazio', 'Roma'),
            new Sede('6', 'Distaccamento Cittadino Eur', null, 'Piazza F. Vivona, 4 00144 Roma', 'Distaccamento', 'Lazio', 'Roma'),
            new Sede('7', 'Distaccamento Cittadino Fluviale', null, 'Lungotevere Arnaldo da Brescia 00100 Roma', 'Distaccamento', 'Lazio', 'Roma'),
            new Sede('8', 'Distaccamento Cittadino La Rustica', null, 'Via Achille Vertunni, 98 00155 Roma', 'Distaccamento', 'Lazio', 'Roma')
        ];
        this.unitaAttualeS.unitaSelezionata = sedeAttuale;
        this.unitaAttualeS.sendUnitaOperativaAttuale(sedeAttuale);
        this.unitaAttualeS.startCount++;
    }

    @HostListener('document:keydown.escape') onKeydownHandler() {
        this.annullaCambioSede();
    }

    ngOnInit() {
        this.getTreeViewItems();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelectedChange(value) {
        if (!this.initItem) {
            this.initItem = value;
        } else {
            this.checkedCount++;
            this.selectedItem = value;
        }
        // console.log(value);
        // console.log(this.treeviewService._get.sediSelezionate(value));
    }

    checkCambioSede() {
        if (this.checkedCount > 0 && this.initItem.toString() !== this.selectedItem.toString()) {
            if (!this.treeviewService._get.sediSelezionate(this.selectedItem).error) {
                // console.log('La sede selezionata è cambiata!');
                this.changeUnitaAttuale(this.selectedItem);
            } else {
                /**
                 * inserire alert quando utente non ha selezionato alcuna sede
                 */
                this.annullaCambioSede();
            }
        } else {
            // console.log('la sede selezionata non è cambiata');
        }
    }

    annullaCambioSede() {
        // console.log('cambio sede è annullato');
        /**
         * inserire alert di annullo cambio sede
         */
        this.getTreeViewItems();
        this.selectedItem = this.initItem;
    }

    changeUnitaAttuale(newUnita) {
        this.openModal(newUnita);
    }

    openModal(newUnita) {
        this.unitaAttualeS.unitaSelezionataString = this.treeviewService._get.sediSelezionate(newUnita).testo;
        this.unitaAttualeS.unitaSelezionata = this.treeviewService._get.sediSelezionate(newUnita).sedi;
        this._modalService.open(CambioSedeModalNavComponent);
    }

    getTreeViewItems() {
        this.treeviewService.getSedi().subscribe(r => {
            this.items = r;
        });
    }

}
