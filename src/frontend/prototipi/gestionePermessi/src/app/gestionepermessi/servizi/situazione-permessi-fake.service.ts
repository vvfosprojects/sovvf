import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { SituazionePermessi } from "app/gestionepermessi/situazione-permessi.model";
import { UnitaOperativa } from "app/gestionepermessi/unita-operativa.model";
import { PermessoAssegnato } from "app/gestionepermessi/permesso-assegnato.model";

@Injectable()
export class SituazionePermessiFakeService {
  private situazionePermessi: SituazionePermessi = new SituazionePermessi(
    [
      new UnitaOperativa("0","DIR-LAZ", "Direzione Regionale Lazio", [
        new UnitaOperativa("1","COM-RM", "Comando Provinciale Roma", []),
        new UnitaOperativa("3","COM-RT", "Comando Provinciale Rieti", []),
        new UnitaOperativa("4","COM-VT", "Comando Provinciale Viterbo", []),
        new UnitaOperativa("5","COM-LT", "Comando Provinciale Latina", []),
        new UnitaOperativa("7","COM-FR", "Comando Provinciale Frosinone", []),
      ]),
      new UnitaOperativa("0", "COA_MAR","COA Marche", []),
    ],
    [
      new PermessoAssegnato("0", "Manuela Marzotti", "MZTMNL11Y23T666I", "Può inserire interventi", "Comando Roma", true, new Date(2017, 5, 5, 10, 9, 20), null),
      new PermessoAssegnato("1", "Manuela Marzotti", "MZTMNL11Y23T666I", "Può vedere interventi", "Comando Roma", false, new Date(2016, 5, 9, 11, 8, 22), new Date(2017, 5, 9, 11, 8, 22)),      
    ]);

  constructor(private http: Http) { }

  public getSituazionePermessi(): Observable<SituazionePermessi> {
    console.log("Service SituazionePermessiFakeService getSituazionePermessi");   
    console.log(this.situazionePermessi);
    return Observable.of(this.situazionePermessi);
  }
}
