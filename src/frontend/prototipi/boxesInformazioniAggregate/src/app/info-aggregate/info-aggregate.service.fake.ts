import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { InfoAggregate } from './info-aggregate.model';
import { InfoMezzo } from './info-mezzo.model';
import { FunzionariSo } from './funzionari-so.model';
import { DescMeteoMap } from './desc-meteo-map.class';

import { environment } from "environments/environment";

@Injectable()
export class InfoAggregateServiceFake {

  constructor() { }

  public getInfoAggregate(): Observable<InfoAggregate[]> {
    var informazioni: InfoAggregate[] = [
      new InfoAggregate(
        "R0",
        "123.456.999",
        false,
        new Date(),
        new Date(),
        true,
        1,
        ["Incendio generico", "Soccorso a persona", "Incidente stradale"],
        "Incendio zona III rotonda prima del centro abitato",
        "Carabinieri",
        "06 41 42 342",
        "Via Cavour, 5",
        ["Tus", "Eur", "Ost"],
        "Vicino pompa di benzina",
        ["Sisma", "Esplosione"],
        moment().add(3, 'minutes').toDate(),
        "987654321",
        0,
        "Non necessario",
        10,
        2,
        "Bassa",
        [
          new Squadra("1A",
            null,
            [
              new Componente(
                "CR",
                "Mario Rossi",
                "Mario Rossi - MRORSS45H44T656R",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Antonio Bianchi",
                "Antonio Bianchi - NTNBNC76T54H444T",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Matteo Verdi",
                "Matteo Verdi - VRDMTT56G77D454I",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Enrico Ottavi",
                "Enrico Ottavi - NRCOTT88U75F454H",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Michele Rettore",
                "Michele Rettore - MCHRTT65T65K575Q",
                false,
                false,
                true),
            ]),
        
    ];

    return Observable.of(richieste);      
  }
}
