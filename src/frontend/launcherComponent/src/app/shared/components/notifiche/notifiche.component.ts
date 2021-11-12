import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificaInterface } from '../../interface/notifica.interface';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-notifiche',
    templateUrl: './notifiche.component.html',
    styleUrls: ['./notifiche.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificheComponent implements OnInit {

    @Input() listaNotifiche: NotificaInterface[];
    @Input() nuoveNotifiche: number;
    @Input() nightMode: boolean;

    @Output() notificheLette: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() notificaSelezionata: EventEmitter<NotificaInterface> = new EventEmitter<NotificaInterface>();

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
        return this.nuoveNotifiche ? 'btn-primary' : 'btn-light';
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
        this.notificaSelezionata.emit(notifica);
    }
}
