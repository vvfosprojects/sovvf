import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UnitaOperativaTreeviewService } from '../navbar-service/unita-operativa-treeview-service/unita-operativa-treeview.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { CambioSedeModalNavComponent } from '../cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import { UnitaAttualeService } from '../navbar-service/unita-attuale/unita-attuale.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-unita-operativa-treeview',
    templateUrl: './unita-operativa-treeview.component.html',
    styleUrls: ['./unita-operativa-treeview.component.css']
})
export class UnitaOperativaTreeviewComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    unitaAttuale: Sede[];
    treeViewOpened: boolean;

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
                private _modalService: NgbModal,
                private toastr: ToastrService) {
        this.unitaAttuale = this.unitaAttualeS.unitaSelezionata;
        this.subscription.add(
            this.unitaAttualeS.getUnitaOperativaAttuale().subscribe(unitaAttuale => {
                this.unitaAttuale = unitaAttuale;
                if (this.unitaAttuale.length > 0) {
                    this.sedeCorrenteString = this.treeviewService.getSediAttualiString();
                    this.clearInitItem();
                }
            })
        );
        this.subscription.add(
            this.unitaAttualeS.getAnnullaTreeView().subscribe(statoTreeView => {
                if (statoTreeView) {
                    this.annullaCambioSede('annulla');
                }
            })
        );

        const sedeAttuale = [
            // new Sede('1', 'Comando di Roma', new Coordinate(41.899940, 12.491270), 'Via Genova, 1, 00184 Roma RM', 'Comando', 'Lazio', 'Roma'),
            new Sede('6', 'Distaccamento Cittadino Eur', null, 'Piazza F. Vivona, 4 00144 Roma', 'Distaccamento', 'Lazio', 'Roma'),
            new Sede('7', 'Distaccamento Cittadino Fluviale', null, 'Lungotevere Arnaldo da Brescia 00100 Roma', 'Distaccamento', 'Lazio', 'Roma'),
            new Sede('8', 'Distaccamento Cittadino La Rustica', null, 'Via Achille Vertunni, 98 00155 Roma', 'Distaccamento', 'Lazio', 'Roma'),
            // new Sede('9', 'Distaccamento Fondi', null, 'xxx indirizzo Fondi', 'Distaccamento', 'Lazio', 'Latina'),

        ];
        this.unitaAttualeS.unitaSelezionata = sedeAttuale;
        this.unitaAttualeS.sendUnitaOperativaAttuale(sedeAttuale);
        this.unitaAttualeS.startCount++;
    }


    @HostListener('document:keydown.escape') onKeydownHandler() {
        if (this.treeViewOpened) {
            this.annullaCambioSede('esc');
        }
    }

    ngOnInit() {
        this.getTreeViewItems();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    openDropDown(value: any) {
        this.treeViewOpened = !!value;
        if (value) {
            // console.log('dropdown aperto');
        } else if (this.selectedItem) {
            // console.log('dropdown chiuso');
            this.checkCambioSede();
        } else {
            // console.log('dropdown chiuso e nessuna modifica');
        }
    }

    getValue(value: any) {
        if (!this.initItem || this.checkedCount === 0) {
            // console.log(`selezione iniziale: ${value}`);
            this.initItem = value;
        } else {
            // console.log(`selezione corrente: ${value}`);
            this.selectedItem = value;
        }
        this.checkedCount++;
    }

    checkCambioSede() {
        if (this.initItem.toString() !== this.selectedItem.toString()) {
            if (!this.treeviewService._get.sediSelezionate(this.selectedItem).error) {
                // console.log('La sede selezionata è cambiata!');
                this.changeUnitaAttuale(this.selectedItem);
            } else {
                this.annullaCambioSede('nessuna');
            }
        } else {
            // console.log('la sede selezionata non è cambiata');
        }
    }

    clearInitItem() {
        this.getTreeViewItems();
    }

    annullaCambioSede(tipo: string) {
        // console.log('cambio sede è annullato');
        this.getTreeViewItems();
        this.selectedItem = this.initItem;
        const mAlertObj = mAlert(tipo);

        this.showAlert(mAlertObj.title, mAlertObj.message, mAlertObj.type);

        function mAlert(value: any) {
            const title = 'Attenzione';
            const type = 'warning';
            let message = '';
            switch (value) {
                case 'esc':
                    message = 'Azione annullata';
                    break;
                case 'annulla':
                    message = 'Cambio sede annullato';
                    break;
                case 'nessuna':
                    message = 'Nessuna sede selezionata';
                    break;
            }
            return {
                title: title,
                message: message,
                type: type
            };
        }
    }

    changeUnitaAttuale(newUnita: any) {
        /**
         * richiama il metodo che apre la modale
         */
        this.openModal(newUnita);
    }

    openModal(newUnita: any) {
        /**
         * apre la modale e aggiorna il testo della sede per il messaggio di conferma
         * e le sedi sulle quali fare la next su sede attuale.
         * @type {string}
         */
        this.unitaAttualeS.unitaSelezionataString = this.treeviewService._get.sediSelezionate(newUnita).testo;
        this.unitaAttualeS.unitaSelezionata = this.treeviewService._get.sediSelezionate(newUnita).sedi;
        this._modalService.open(CambioSedeModalNavComponent);
    }

    getTreeViewItems() {
        this.checkedCount = 0;
        this.treeviewService.getSedi().subscribe(r => {
            this.items = r;
        });
    }

    showAlert(title: string, message: string, type: any) {
        this.toastr[type](message, title, {
            timeOut: 2500
        });
    }

}
