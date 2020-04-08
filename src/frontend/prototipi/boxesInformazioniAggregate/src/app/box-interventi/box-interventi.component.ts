import { Component, OnInit, Input } from '@angular/core';
import { InterventiSo } from "app/box-interventi/box-interventi.model";

@Component({
  selector: 'box-interventi',
  templateUrl: './box-interventi.component.html',
  styleUrls: ['./box-interventi.component.css']
})
export class BoxInterventiComponent implements OnInit {

  @Input() interventi: InterventiSo;
   
  constructor() { }

  ngOnInit() {
  }

}
