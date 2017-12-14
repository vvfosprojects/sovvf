import { Component, OnInit, Input } from '@angular/core';

import { InfoAggregate } from '../info-aggregate/info-aggregate.model';

@Component({
  selector: 'box-interventi',
  templateUrl: './box-interventi.component.html',
  styleUrls: ['./box-interventi.component.css']
})
export class BoxInterventiComponent implements OnInit {

  @Input() interventi: InfoAggregate[];
   
  constructor() { }

  ngOnInit() {
  }

}
