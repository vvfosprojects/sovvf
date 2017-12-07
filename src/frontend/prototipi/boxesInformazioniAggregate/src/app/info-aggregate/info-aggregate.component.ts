import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { InfoAggregate } from './info-aggregate.model';


@Component({
  selector: 'app-info-aggregate',
  templateUrl: './info-aggregate.component.html',
  styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit {
  @Input() info: InfoAggregate;

  constructor() {}

  ngOnInit() {
   
  }

  get inf(): InfoAggregate {
    
        return this.info;
    
      }
   
 
}
