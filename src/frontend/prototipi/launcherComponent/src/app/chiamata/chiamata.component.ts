import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chiamata',
  templateUrl: './chiamata.component.html',
  styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit {
  people = ['ciao', 'ciao2'];
  constructor() { }

  ngOnInit() {
  }

}
