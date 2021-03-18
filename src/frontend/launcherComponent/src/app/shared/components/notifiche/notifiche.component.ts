import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificaInterface } from '../../interface/notifica.interface';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TipoNotifica } from '../../enum/tipo-notifica.enum';

@Component({
    selector: 'app-notifiche',
    templateUrl: './notifiche.component.html',
    styleUrls: ['./notifiche.component.css']
})
export class NotificheComponent implements OnInit {

    @Input() listaNotifiche: NotificaInterface[];
    @Input() nuoveNotifiche: number;

    @Output() notificheLette: EventEmitter<boolean> = new EventEmitter<boolean>();

    active: number;

    constructor(private tooltipConfig: NgbTooltipConfig) {
        tooltipConfig.container = 'body';
    }

    ngOnInit(): void {
    }

    getTooltip(): string {
        return this.nuoveNotifiche ? 'Hai ' + this.nuoveNotifiche + ' nuove Notifiche ' : 'Nessuna Notifica';
    }

    getClasses(): string {
        return this.nuoveNotifiche ? 'btn-primary' : 'btn-outline-light';
    }

    onToggleDropdown(open: boolean): void {
        if (!open) {
            this.onNotificheLette();
        }
    }

    onNotificheLette(): void {
        this.notificheLette.emit();
    }

    setActive(index: number): void {
        this.active = index;
    }

    clearActive(): void {
        this.active = null;
    }

    onSelezione(notifica: NotificaInterface): void {
        switch (notifica.tipo) {
            case TipoNotifica.TrasferimentoChiamata:
                return;
        }
    }
}
