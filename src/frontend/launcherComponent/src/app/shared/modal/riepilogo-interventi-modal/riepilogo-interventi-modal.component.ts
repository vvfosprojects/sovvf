import { Component } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { DistaccamentiState } from '../../store/states/distaccamenti/distaccamenti.state';
import { Observable, Subscription } from 'rxjs';
import { Sede } from '../../model/sede.model';

@Component({
    selector: 'app-riepilogo-interventi-modal',
    templateUrl: './riepilogo-interventi-modal.component.html',
    styleUrls: ['./riepilogo-interventi-modal.component.css']
})
export class RiepilogoInterventiModalComponent {

    @Select(DistaccamentiState.distaccamenti) distaccamenti$: Observable<Sede[]>;
    distaccamenti: Sede[];

    turno = [{ id: 'test 1', descrizione: 'test 1' }, { id: 'test 2', descrizione: 'test 2' }];
    squadra = [{ id: 'test 3', descrizione: 'test 3' }, { id: 'test 4', descrizione: 'test 4' }];

    prefix: {} = {
        DaA: true,
    };
    altriFiltri = {
        tipologia: false,
        trasmessi: false,
        interventi: false,
    };
    periodoChiuseToShow: any = {
        daA: null,
    };
    outsideDays: 'visible';
    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate;
    toDate: NgbDate | null = null;
    date: { year: number, month: number };
    todayDate;
    showFiltriInterventi = true;
    showFiltriSquadre = true;
    showAltriFiltri = true;
    distaccamentoSelezionato: string;
    squadraSelezionata: string;
    turnoSelezionato: string;

    subscription: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal, calendar: NgbCalendar) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
        this.todayDate = calendar.getToday();
        this.getDistaccamenti();
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
    }

    getDistaccamenti(): void {
        this.subscription.add(
            this.distaccamenti$.subscribe((distaccamenti: Sede[]) => {
                this.distaccamenti = distaccamenti;
            })
        );
    }

    onShowFiltriInterventi(): void {
        this.showFiltriInterventi = !this.showFiltriInterventi;
    }

    onShowFiltriSquadre(): void {
        this.showFiltriSquadre = !this.showFiltriSquadre;
    }

    onShowAltriFiltri(): void {
        this.showAltriFiltri = !this.showAltriFiltri;
    }

    onCheckFiltro(key: string): void {
        if (this.prefix[key]) {
            this.prefix[key] = false;
        } else {
            Object.keys(this.prefix).forEach(x => this.prefix[x] = x === key);
        }
    }

    onCheckAltriFiltri(key: string): void {
        if (this.altriFiltri[key]) {
            this.altriFiltri[key] = false;
        } else {
            Object.keys(this.altriFiltri).forEach(x => this.altriFiltri[x] = x === key);
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

    chiudiRiepilogoInterventiModal(closeRes: string): void {
        if (closeRes === 'ok') {
            this.modal.close({
                status: 'ok',
                result: {
                    da: this.prefix['DaA'] ? this.formatDate(this.fromDate) : null,
                    a: this.prefix['DaA'] ? this.formatDate(this.toDate) : null,
                    distaccamento: this.distaccamentoSelezionato ? this.distaccamentoSelezionato : null,
                    turno: this.turnoSelezionato ? this.turnoSelezionato : null,
                    squadra: this.squadraSelezionata ? this.squadraSelezionata : null,
                    altriFiltri: {
                        tipologiaIntervento: this.altriFiltri.tipologia ? this.altriFiltri.tipologia : null,
                        trasmessi: this.altriFiltri.trasmessi ? this.altriFiltri.trasmessi : null,
                        soloInterventi: this.altriFiltri.interventi ? this.altriFiltri.interventi : null,
                    }
                },
            });
        } else {
            this.modal.close({ status: 'ko' });
        }
    }

    onPatchFiltriSquadre(event: any, tipologia: string): void {
        console.log('***onPatchFiltriSquadre ', event);
        switch (tipologia) {
            case 'distaccamenti':
                if (event) {
                    this.distaccamentoSelezionato = event.codice;
                }
                break;

            case 'turno':
                if (event) {
                    this.turnoSelezionato = event.id;
                }
                break;

            case 'squadra':
                if (event) {
                    this.squadraSelezionata = event.id;
                }
                break;
        }
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
