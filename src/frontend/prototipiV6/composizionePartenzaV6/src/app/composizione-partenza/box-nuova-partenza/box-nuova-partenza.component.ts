import { Component, OnInit, Input } from '@angular/core';
import { BoxPartenza } from '../model/box-partenza.model';

@Component({
  selector: 'app-box-nuova-partenza',
  templateUrl: './box-nuova-partenza.component.html',
  styleUrls: ['./box-nuova-partenza.component.css']
})
export class BoxNuovaPartenzaComponent implements OnInit {
  @Input() partenza: BoxPartenza;

  constructor() { }

  ngOnInit() {
    // console.log(this.partenza);
  }
}
