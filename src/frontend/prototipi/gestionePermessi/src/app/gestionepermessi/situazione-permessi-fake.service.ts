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
      new UnitaOperativa("DIR-LAZ", "Direzione Regionale Lazio", "DIR-LAZ", [
        new UnitaOperativa("COM-RM", "Comando Provinciale Roma", "COM-RM", []),
        new UnitaOperativa("COM-RT", "Comando Provinciale Rieti", "DIR_LAZ", []),
        // new UnitaOperativa("COM-VT", "Comando Provinciale Viterbo", "DIR_LAZ", []),
        // new UnitaOperativa("COM-LT", "Comando Provinciale Latina", "DIR_LAZ", []),
        // new UnitaOperativa("COM-FR", "Comando Provinciale Frosinone", "DIR_LAZ", []),
      ]),
      new UnitaOperativa("0", "COA Marche", "COA_MAR", []),
    ],
    [
      new PermessoAssegnato("0", "Manuela Marzotti", "MZTMNL11Y23T666I", "Può inserire interventi", "Comando Roma", true, new Date(), null),
      new PermessoAssegnato("0", "Manuela Marzotti", "MZTMNL11Y23T666I", "Può inserire interventi", "Comando Roma", true, new Date(), null),      
    ]);

  constructor(private http: Http) { }

  public getSituazionePermessi(): Observable<SituazionePermessi> {
    return Observable.of(this.situazionePermessi);
  }
}
