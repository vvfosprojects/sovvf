import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { InfoAggregate } from './info-aggregate.model';
import { Observable } from "rxjs/Observable";


@Component({
  selector: 'app-info-aggregate',
  templateUrl: './info-aggregate.component.html',
  styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit {
  @Input() informazioni: InfoAggregate[];
 /// @Output() showDettagli: EventEmitter<InfoAggregate> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    console.log("Informazioni: ", this.informazioni);
      }
 
}
