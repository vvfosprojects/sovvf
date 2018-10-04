import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitaOperativaService } from './navbar-service/richiesta-selezionata-service/unita-operativa.service';
import * as moment from 'moment';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() user: any;
  @Output() openedSidebar: EventEmitter<any> = new EventEmitter();
  unitaOperative: Array<string>;
  unitaAttuale: string;
  time: string;
  searchUnita: string;

  constructor(private unitaOperativaS: UnitaOperativaService) { }

  ngOnInit() {
    this.nowDate();
    this.getUnitaOperative();
    this.getUnitaAttuale();

    /* Setto il comando a 'Roma' */
    this.unitaOperativaS.sendUnitaOperativaAttuale('Comando di Roma');
  }

  /* Unità operativa methods */
  getUnitaOperative() {
    this.unitaOperativaS.getUnitaOperative().subscribe(unitaOperative => {
      this.unitaOperative = unitaOperative;
    });
  }

  getUnitaAttuale() {
    this.unitaOperativaS.getUnitaOperativaAttuale().subscribe(unitaAttuale => {
      this.unitaAttuale = unitaAttuale;
    });
  }

  changeUnitaAttuale(newUnita) {
    this.unitaOperativaS.sendUnitaOperativaAttuale(newUnita);
  }
  /* End unità operativa methods */

  nowDate() {
    const moment$ = new Observable<any>((observer) => {
      setInterval(() => observer.next(moment().format('DD/MM/YYYY, HH:MM')));
    });
    moment$.subscribe(res => {
      this.time = res;
    });
  }

  openSidebar() {
    this.openedSidebar.emit();
  }
}
