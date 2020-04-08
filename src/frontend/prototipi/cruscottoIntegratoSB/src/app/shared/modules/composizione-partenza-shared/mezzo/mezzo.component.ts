import { Component, OnInit, Input } from '@angular/core';

import { Mezzo } from './mezzo.model';

@Component({
  selector: 'app-mezzo',
  templateUrl: './mezzo.component.html',
  styleUrls: ['./mezzo.component.css']
})
export class MezzoComponent implements OnInit {
  @Input() mezzo: Mezzo;
  constructor() { }

  ngOnInit() {
  }

}
