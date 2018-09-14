import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() openedSidebar: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openSidebar() {
    this.openedSidebar.emit();
  }
}
