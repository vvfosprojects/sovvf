import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RiepilogoInterventiModalComponent } from '../../shared/modal/riepilogo-interventi-modal/riepilogo-interventi-modal.component';
import { NavbarState } from '../navbar/store/states/navbar.state';
import { ToggleSidebarOpened } from '../navbar/store/actions/navbar.actions';
import { Store } from '@ngxs/store';
import { AzioniAreaDocumentaleModalComponent } from '../../shared/modal/azioni-area-documentale-modal/azioni-area-documentale-modal.component';
import { FiltriAreaDocumentaleState } from '../../shared/store/states/filtri-area-documentale/filtri-area-documentale.state';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];
    @Input() url: string;
    @Input() disabledGestioneUtenti: boolean;
    @Input() disabledImpostazioniSede: boolean;

    @Output() logout = new EventEmitter();

    RoutesPath = RoutesPath;

    constructor(private modalService: NgbModal,
                private store: Store) {
    }

    /**
     * Stampa Riepilogo Interventi
     */
    onRiepilogoInterventi(): void {
        this.onToggleSidebar();
        const modalOptions = {
            windowClass: '',
            backdrop: 'static',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            keyboard: false,
            size: 'lg',
        } as NgbModalOptions;
        const modal = this.modalService.open(RiepilogoInterventiModalComponent, modalOptions);
        modal.result.then((res: any) => {
            switch (res.status) {
                case 'ok':
                    break;
                case 'ko':
                    break;
            }
        });
    }

    /**
     * Azioni Area Documentale
     */
    onShowAzioniAreaDocumentale(): void {
        let modalOptions;
        if (open) {
            modalOptions = {
                windowClass: '',
                backdrop: 'static',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                keyboard: false,
                size: 'xl',
            } as NgbModalOptions;
        }
        const modal = this.modalService.open(AzioniAreaDocumentaleModalComponent, modalOptions);
        modal.componentInstance.filtriAreaDocumentale = this.store.selectSnapshot(FiltriAreaDocumentaleState.filtriAreaDocumentale);
    }

    onToggleSidebar(): void {
        const sidebarOpened = this.store.selectSnapshot(NavbarState.sidebarOpened);
        this.store.dispatch(new ToggleSidebarOpened(!sidebarOpened));
    }

    onOpenOpservice(): void {
        window.open('https://opservice-demo.dipvvf.it', '_blank', 'toolbar=0,location=0,menubar=0,height=' + screen.availHeight + ',width=' + screen.availWidth);
    }

    onLogout(): void {
        this.logout.emit();
    }
}
