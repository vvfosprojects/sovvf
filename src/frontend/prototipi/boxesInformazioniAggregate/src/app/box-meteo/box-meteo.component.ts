import { Component, OnInit, Input } from '@angular/core';

import { InfoAggregate } from '../info-aggregate/info-aggregate.model';
import { DescMeteoMap } from './desc-meteo-map.class';
@Component({
  selector: 'box-meteo',
  templateUrl: './box-meteo.component.html',
  styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent implements OnInit {

  private mapperDescMeteo = new DescMeteoMap();

  @Input() previsioni: InfoAggregate[];
  

  constructor() { }

  ngOnInit() {
  }


  public getDescrizioneMeteo(codice: string): string {
    return this.mapperDescMeteo.map(codice);
  }

}
