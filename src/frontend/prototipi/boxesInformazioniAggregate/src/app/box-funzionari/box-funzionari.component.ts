import { Component, OnInit, Input } from '@angular/core';

import { InfoAggregate } from '../info-aggregate/info-aggregate.model';

@Component({
  selector: 'box-funzionari',
  templateUrl: './box-funzionari.component.html',
  styleUrls: ['./box-funzionari.component.css']
})
export class BoxFunzionariComponent implements OnInit {

  @Input() funzionari: InfoAggregate[];

  constructor() { }

  ngOnInit() {
  }

}
