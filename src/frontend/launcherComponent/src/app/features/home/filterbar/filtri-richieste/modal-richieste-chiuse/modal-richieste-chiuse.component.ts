import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { TurnoState } from '../../../../navbar/store/states/turno.state';
import { TurnoCalendario } from '../../../../navbar/turno/model/turno-calendario.model';
import { FiltroChiuseDettaglio } from '../../../../../shared/interface/filtro-chiuse-dettaglio.interface';

@Component({
    selector: 'app-modal-richieste-chiuse',
    templateUrl: './modal-richieste-chiuse.component.html',
    styleUrls: ['./modal-richieste-chiuse.component.css']
})
export class ModalRichiesteChiuseComponent implements OnInit, OnDestroy {

    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
    turnoCalendario: TurnoCalendario;

    prefix: {} = {
        DaA: false,
        Del: true,
        Turno: false,
    };
    periodoChiuseToShow: any = {
        daA: null,
        data: null,
        turno: null,
    };
    navigation: 'select';
    outsideDays: 'visible';
    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate;
    toDate: NgbDate | null = null;
    date: { year: number, month: number };
    todayDate;
    titolo: string;
    periodoChiuse: FiltroChiuseDettaglio;
    disableConferma = false;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal, private calendar: NgbCalendar) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
        this.getTurnoCalendario();
        this.todayDate = calendar.getToday();
    }

    ngOnInit(): void {
        // check per aggiornare filtri da impostazione precedente
        if (this.periodoChiuse) {
            if (this.periodoChiuse.turno) {
                this.onCheckFiltro('Turno');
            } else if (this.periodoChiuse.data) {
                this.datePreviousValue();
            } else if (this.periodoChiuse.daA) {
                this.fromToPreviousValue();
            }
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getTurnoCalendario(): void {
        this.subscriptions.add(
            this.turnoCalendario$.subscribe((turnoC: TurnoCalendario) => {
                this.turnoCalendario = turnoC;
            })
        );
    }

    formatDate(date: any): any {
        date.month = date.month - 1;
        const day = date.day;
        const month = date.month;
        const year = date.year;
        const dateFormatted = new Date(year, month, day, 10, 0, 0, 0);
        return dateFormatted;
    }

    formatDatetoShow(): any {
        this.periodoChiuseToShow = {
            daA: null,
            data: null,
            turno: null,
        };
        let da;
        let a;
        da = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
        a = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
        this.periodoChiuseToShow.daA = this.prefix['DaA'] ? da + ' - ' + a : null;
        this.periodoChiuseToShow.data = this.prefix['Del'] ? this.todayDate.day + '/' + this.todayDate.month + '/' + this.todayDate.year : null;
        this.periodoChiuseToShow.turno = this.prefix['Turno'] ? this.turnoCalendario.corrente : null;
    }

    onCheckFiltro(key: string): void {
        if (this.prefix[key]) {
            this.prefix[key] = false;
        } else {
            Object.keys(this.prefix).forEach(x => this.prefix[x] = x === key);
        }
    }

    chiudiModalFiltriTipologia(closeRes: string): void {
        if (closeRes === 'ok') {
            if (this.fromDate && !this.toDate) {
                this.disableConferma = true;
            } else {
                this.formatDatetoShow();
                this.disableConferma = false;
                this.modal.close({
                    status: 'ok',
                    result: {
                        da: this.prefix['DaA'] ? this.formatDate(this.fromDate) : null,
                        a: this.prefix['DaA'] ? this.formatDate(this.toDate) : null,
                        data: this.prefix['Del'] ? this.formatDate(this.todayDate) : null,
                        turno: this.prefix['Turno'] ? this.turnoCalendario.corrente : null,
                    },
                    date: this.periodoChiuseToShow,
                });
            }
        } else {
            this.modal.close({ status: 'ko' });
        }
    }

    onDateSelection(date: NgbDate): void {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    datePreviousValue(): void {
        const firstIndex = this.periodoChiuse.data.indexOf('/');
        const lastIndex = this.periodoChiuse.data.lastIndexOf('/');
        this.todayDate.day = +(this.periodoChiuse.data.slice(0, firstIndex));
        this.todayDate.month = +(this.periodoChiuse.data.slice(firstIndex + 1, lastIndex));
        this.todayDate.year = +(this.periodoChiuse.data.slice(this.periodoChiuse.data.length - 4, this.periodoChiuse.data.length));
    }

    fromToPreviousValue(): void {
        this.onCheckFiltro('DaA');
        const fullDate = this.periodoChiuse.daA.replace(/\s/g, '');
        const cutPoint = fullDate.indexOf('-');
        const from = fullDate.slice(0, cutPoint);
        const to = fullDate.slice(cutPoint + 1, this.periodoChiuse.daA.length);

        const firstIndexFrom = from.indexOf('/');
        const lastIndexFrom = from.lastIndexOf('/');
        this.fromDate.day = +(from.slice(0, firstIndexFrom));
        this.fromDate.month = +(from.slice(firstIndexFrom + 1, lastIndexFrom));
        this.fromDate.year = +(from.slice(from.length - 4, from.length));

        const firstIndexTo = to.indexOf('/');
        const lastIndexTo = to.lastIndexOf('/');
        this.toDate.day = +(to.slice(0, firstIndexTo));
        this.toDate.month = +(to.slice(firstIndexTo + 1, lastIndexTo));
        this.toDate.year = +(to.slice(to.length - 4, to.length));
    }

    isHovered(date: NgbDate): boolean {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate): boolean {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate): boolean {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
    }
}
