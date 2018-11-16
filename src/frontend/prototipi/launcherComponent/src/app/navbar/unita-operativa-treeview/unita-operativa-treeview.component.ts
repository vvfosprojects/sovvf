import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UnitaOperativaTreeviewService } from '../navbar-service/unita-operativa-treeview-service/unita-operativa-treeview.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { CambioSedeModalNavComponent } from '../cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import { UnitaAttualeService } from '../navbar-service/unita-attuale/unita-attuale.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Sede } from '../../shared/model/sede.model';
import { Coordinate } from '../../shared/model/coordinate.model';


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
            })
        );
        /**
         * provvisorio
         */
        const sedeAttuale = [new Sede('1', 'Comando di Roma', new Coordinate(41.900170, 12.491000), 'Via Genova, 1, 00184 Roma RM', 'Comando', 'Lazio', 'Roma')];
        this.unitaAttualeS.sendUnitaOperativaAttuale(sedeAttuale);
        this.unitaAttualeS.startCount++;
    }

    @HostListener('document:keydown.escape') onKeydownHandler() {
        this.annullaCambioSede();
    }

    ngOnInit() {
        this.treeviewService.getSedi().subscribe(r => {
            this.items = r;
        });
        if (this.unitaAttuale.length > 1) {
            this.sedeCorrenteString = 'più sedi selezionate';
        } else {
            this.sedeCorrenteString = this.unitaAttuale[0].descrizione;
        }
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
        console.log('Sedi selezionate: ', value.toString());
    }

    cambioSede() {
        if (this.checkedCount > 0 && this.initItem.toString() !== this.selectedItem.toString()) {
            console.log('La sede è cambiata!');
        } else {
            console.log('la sede non è cambiata');
        }
    }

    annullaCambioSede() {
        console.log('annulla cambio sede');
    }

    changeUnitaAttuale(newUnita) {
        this.openModal(newUnita);
    }

    openModal(newUnita) {
        this.unitaAttualeS.unitaSelezionata.push(newUnita);
        this._modalService.open(CambioSedeModalNavComponent);
    }

}
