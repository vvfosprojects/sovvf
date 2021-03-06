import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoutesPath } from '../../enum/routes-path.enum';
import { Ruolo, Utente } from '../../model/utente.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RiepilogoInterventiModalComponent } from '../../modal/riepilogo-interventi-modal/riepilogo-interventi-modal.component';
import { NavbarState } from '../../../features/navbar/store/states/navbar.state';
import { ToggleSidebarOpened } from '../../../features/navbar/store/actions/navbar.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];
    @Input() url: string;

    @Output() logout = new EventEmitter();

    RoutesPath = RoutesPath;

    constructor(private modalService: NgbModal, private store: Store) {
    }

    ngOnInit(): void {
    }

    /**
     * Stampa Riepilogo Interventi
     */
    onRiepilogoInterventi(): void {
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

    onToggleSidebar(): void {
        const sidebarOpened = this.store.selectSnapshot(NavbarState.sidebarOpened);
        this.store.dispatch(new ToggleSidebarOpened(!sidebarOpened));
    }

    onLogout(): void {
        this.logout.emit();
    }

}
