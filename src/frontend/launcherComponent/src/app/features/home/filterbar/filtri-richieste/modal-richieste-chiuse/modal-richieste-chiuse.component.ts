import { Component, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal, NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {TurnoState} from '../../../../navbar/store/states/turno.state';
import {TurnoCalendario} from '../../../../navbar/turno/turno-calendario.model';
import {ImpostazioniState} from '../../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
  selector: 'app-modal-richieste-chiuse',
  templateUrl: './modal-richieste-chiuse.component.html',
  styleUrls: ['./modal-richieste-chiuse.component.css']
})
export class ModalRichiesteChiuseComponent implements OnDestroy {

  @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
  turnoCalendario: TurnoCalendario;
  @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
  nightMode: boolean;

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
  date: {year: number, month: number};
  todayDate;

  subscription: Subscription = new Subscription();

  constructor(private modal: NgbActiveModal, calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
    this.getTurnoCalendario();
    this.todayDate = calendar.getToday();
    this.getNightMode();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTurnoCalendario(): void {
    this.subscription.add(
      this.turnoCalendario$.subscribe((turnoC: TurnoCalendario) => {
        this.turnoCalendario = turnoC;
      })
    );
  }

  getNightMode(): void {
    this.subscription.add(
      this.nightMode$.subscribe((nightMode: boolean) => {
        this.nightMode = nightMode;
      })
    );
  }

  onNightMode(): string {
    let value = '';
    if (!this.nightMode) {
      value = '';
    } else if (this.nightMode) {
      value = 'moon-text moon-mode';
    }
    return value;
  }

  formatDate(date: any): any {
    date.month = date.month - 1;
    const day = date.day;
    const month = date.month;
    const year = date.year;
    const dateFormatted = new Date( year, month, day, 10, 0, 0, 0);
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
      this.formatDatetoShow();
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
    } else {
      this.modal.close({ status: 'ko'});
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

  isHovered(date: NgbDate): boolean {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate): boolean {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate): boolean  {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
}
