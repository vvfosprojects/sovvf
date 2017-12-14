import { Component, OnInit, Input } from '@angular/core';

import { InfoAggregate } from '../info-aggregate/info-aggregate.model';

@Component({
  selector: 'box-mezzi',
  templateUrl: './box-mezzi.component.html',
  styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnInit {

  @Input() mezzi: InfoAggregate[];

  constructor() { }

  ngOnInit() {
  }

}
