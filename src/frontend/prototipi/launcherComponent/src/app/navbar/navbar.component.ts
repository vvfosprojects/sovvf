import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() user: any;
  @Output() openedSidebar: EventEmitter<any> = new EventEmitter();
  moment = new Observable<any>((observer) => {
    setInterval( () => observer.next(moment().format('DD/MM/YYYY, HH:MM:ss')));
  });
  time;

  constructor() { }

  ngOnInit() {
    this.moment.subscribe(res => {
      this.time = res;
    });
  }

  openSidebar() {
    this.openedSidebar.emit();
  }
}
