import { Component, OnInit, Input } from '@angular/core';
import { BoxMeteo } from './box-meteo.model';

@Component({
  selector: 'app-box-meteo',
  templateUrl: './box-meteo.component.html',
  styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent implements OnInit {
  iconaUrl: string;
  @Input() meteo: BoxMeteo;
  constructor() { }

  ngOnInit() {
    // console.log(this.meteo);
  }
}
