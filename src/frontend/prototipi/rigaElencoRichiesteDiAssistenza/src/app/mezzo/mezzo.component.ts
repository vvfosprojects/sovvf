import { Component, OnInit, Input } from '@angular/core';

import { Mezzo } from "app/mezzo/mezzo.model";

@Component({
  selector: 'mezzo',
  templateUrl: './mezzo.component.html',
  styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent implements OnInit {
  @Input() mezzo: Mezzo;
  
  constructor() { }

  ngOnInit() {
  }

}
