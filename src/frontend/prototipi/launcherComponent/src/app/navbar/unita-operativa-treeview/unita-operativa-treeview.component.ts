import { Component, HostListener, OnInit } from '@angular/core';
import { UnitaOperativaTreeviewService } from '../navbar-service/unita-operativa-treeview-service/unita-operativa-treeview.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { CambioSedeModalNavComponent } from '../cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import { UnitaAttualeService } from '../navbar-service/unita-attuale/unita-attuale.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-unita-operativa-treeview',
    templateUrl: './unita-operativa-treeview.component.html',
    styleUrls: ['./unita-operativa-treeview.component.css']
})
export class UnitaOperativaTreeviewComponent implements OnInit {

    items: TreeviewItem[];
    initItem: any[];
    selectedItem: any[];
    checkedCount = 0;

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
    }

    @HostListener('document:keydown.escape') onKeydownHandler() {
        this.annullaCambioSede();
    }

    ngOnInit() {
        this.treeviewService.getSedi().subscribe(r => {
            this.items = r;
        });
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

    openModal(newUnita) {
        this.unitaAttualeS.unitaSelezionata = newUnita;
        this._modalService.open(CambioSedeModalNavComponent);
    }

}
