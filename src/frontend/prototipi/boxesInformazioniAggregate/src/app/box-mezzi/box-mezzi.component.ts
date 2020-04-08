import { Component, OnInit, Input } from '@angular/core';
import {InfoMezzo } from "../box-mezzi/info-mezzo.model";

@Component({
  selector: 'box-mezzi',
  templateUrl: './box-mezzi.component.html',
  styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnInit {

  @Input() mezzi: InfoMezzo[];

  constructor() { }

  ngOnInit() {
  }

}
