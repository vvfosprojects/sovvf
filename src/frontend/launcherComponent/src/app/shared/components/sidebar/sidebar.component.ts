import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoutesPath } from '../../enum/routes-path.enum';
import { Ruolo, Utente } from '../../model/utente.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RiepilogoInterventiModalComponent } from '../../modal/riepilogo-interventi-modal/riepilogo-interventi-modal.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];
    @Input() url: string;

    @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() logout = new EventEmitter();

    RoutesPath = RoutesPath;

    constructor(private modalService: NgbModal) {
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

    onLogout(): void {
        this.logout.emit();
    }

}
