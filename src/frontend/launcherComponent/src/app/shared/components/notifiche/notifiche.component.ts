import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificaInterface } from '../../interface/notifica.interface';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-notifiche',
    templateUrl: './notifiche.component.html',
    styleUrls: ['./notifiche.component.css']
})
export class NotificheComponent implements OnInit {

    @Input() listaNotifiche: NotificaInterface[];
    @Input() nuoveNotifiche: number;

    @Output() notificheLette: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private tooltipConfig: NgbTooltipConfig) {
        tooltipConfig.container = 'body';
    }

    ngOnInit() {
    }

    getTooltip() {
        return this.nuoveNotifiche ? 'Hai ' + this.nuoveNotifiche + ' nuove Notifiche ' : 'Nessuna Notifica';
    }

    getClasses() {
        return this.nuoveNotifiche ? 'btn-primary' : 'btn-outline-light';
    }

    onToggleDropdown(open: boolean) {
        if (!open) {
            this.onNotificheLette();
        }
    }

    onNotificheLette() {
        this.notificheLette.emit();
    }
}
