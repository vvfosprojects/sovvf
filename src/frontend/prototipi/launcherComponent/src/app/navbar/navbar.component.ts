import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { UnitaOperativeServiceFake } from './navbar-service/unita-operativa.service.fake';


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

  constructor(private unitaOperativeS: UnitaOperativeServiceFake) { }

  ngOnInit() {
    this.nowDate();
    this.getUnitaOperative();
    this.setUnitaAttuale();
  }

  getUnitaOperative() {
    this.unitaOperativeS.getUnitaOperative().subscribe(unitaOperative => {
      this.unitaOperative = unitaOperative;
    });
  }
  setUnitaAttuale() {
    this.unitaAttuale = this.unitaOperativeS.getUnitaAttuale();
  }

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
