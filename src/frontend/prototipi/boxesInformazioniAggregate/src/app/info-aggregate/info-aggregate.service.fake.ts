import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { InfoAggregate } from './info-aggregate.model';
import { InfoMezzo } from '../box-mezzi/info-mezzo.model';
import { FunzionariSo } from '../box-funzionari//funzionari-so.model';
import { DescMeteoMap } from '../box-meteo/desc-meteo-map.class';

import { environment } from "environments/environment";

@Injectable()
export class InfoAggregateServiceFake {

  constructor() { }

  public getInfoAggregate(): Observable<InfoAggregate[]> {
    var informazioni: InfoAggregate[] = [
      new InfoAggregate(
        3,
        3,
        1,
        2,
        0,
        [
        new InfoMezzo("APS",
                      2,
                      1,
                      2,
                      0
        ),
        new InfoMezzo("ABP",
        2,
        1,
        1,
        0
        ),
        new InfoMezzo("AS",
        1,
        1,
        0,
        0
        ),
        ],
        3,
        1,
        2,
        0,
        "Neve",
        14,
        20,
        10,
        "bassa",
        [
        new FunzionariSo("RSIMRI62C62H501I",
        "FTID DE ANGELIS ROBERTO SALVATORE",
        "RSIMRI62C62H501I",
        true,
        false,
        false,
        false
        ),
        new FunzionariSo("RSIMRI62C62H501I",
        "FTID ANGE GIOV",
        "VRDGVN61E61H501T",
        false,
        false,
        false,
        true
        ),
       ],
      )
    ];
    return Observable.of(informazioni);      
  }
}
