import { Component, OnInit, Input } from '@angular/core';

import { InfoAggregate } from '../info-aggregate/info-aggregate.model';

@Component({
  selector: 'box-squadre',
  templateUrl: './box-squadre.component.html',
  styleUrls: ['./box-squadre.component.css']
})
export class BoxSquadreComponent implements OnInit {

  @Input() squadre: InfoAggregate[];

  constructor() { }

  ngOnInit() {
  }

}

