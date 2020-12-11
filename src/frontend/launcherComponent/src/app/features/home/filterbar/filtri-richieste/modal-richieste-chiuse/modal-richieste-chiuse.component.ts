import { Component, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal, NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {TurnoState} from '../../../../navbar/store/states/turno.state';
import {TurnoCalendario} from '../../../../navbar/turno/turno-calendario.model';

@Component({
  selector: 'app-modal-richieste-chiuse',
  templateUrl: './modal-richieste-chiuse.component.html',
  styleUrls: ['./modal-richieste-chiuse.component.css']
})
export class ModalRichiesteChiuseComponent implements OnDestroy {

  @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
  turnoCalendario: TurnoCalendario;

  prefix: {} = {
    DaA: false,
    Del: true,
    Turno: false,
  };
  navigation: 'select';
  outsideDays: 'visible';
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  date: {year: number, month: number};

  subscription: Subscription = new Subscription();

  constructor(private modal: NgbActiveModal, calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
    this.getTurnoCalendario();
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

  onCheckFiltro(key: string): void {
    if (this.prefix[key]) {
      this.prefix[key] = false;
    } else {
      Object.keys(this.prefix).forEach(x => this.prefix[x] = x === key);
    }
  }

  chiudiModalFiltriTipologia(closeRes: string): void {
    this.modal.close(closeRes);
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
