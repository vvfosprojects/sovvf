import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { SituazionePermessi } from "../situazione-permessi.model";
import { UnitaOperativa } from "../unita-operativa.model";
import { PermessoAssegnato } from "../permesso-assegnato.model";
import { Permesso } from '../permesso.model';
import { Ruolo } from '../ruolo.model';

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
      new PermessoAssegnato("1", "Marcello Esposito", "ESPMRC11Y87T745Z", "Può vedere interventi", "Comando Roma", false, new Date(2016, 5, 9, 11, 8, 22), new Date(2017, 5, 9, 11, 8, 22)),      
    ],
  [
    new Permesso("VisInt", "Visualizzazione interventi", "Consente all'utente di visualizzare gli interventi", ["OPERAT", "SUPERV"], 0),
    new Permesso("GestInt", "Gestione interventi", "Consente all'utente di gestire un intervento", ["OPERAT"], 1),
    new Permesso("CreaInt", "Creazione interventi", "Consente all'utente di acquisire una chiamata e generare un intervento", ["OPERAT"], 2),
    new Permesso("InviaFono", "Invio fonogrammi", "Consente all'utente di inviare un fonogramma", ["SUPERV"], 3),
  ],
  [
    new Ruolo("OPERAT", "Operatore", "Generico operatore di Sala Operativa", 0),
    new Ruolo("SUPERV", "Supervisore", "Supervisore di Sala Operativa", 1),
    new Ruolo("ADMIN", "Amministratore", "Amministratore di Sala Operativa", 2),
  ]);

  constructor() { }

  public getSituazionePermessi(): Observable<SituazionePermessi> {
    console.log("Service SituazionePermessiFakeService getSituazionePermessi");   
    console.log(this.situazionePermessi);
    return Observable.of(this.situazionePermessi);
  }
}
