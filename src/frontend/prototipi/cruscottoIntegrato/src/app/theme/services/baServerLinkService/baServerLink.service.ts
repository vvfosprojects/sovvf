import { Injectable, OnInit } from '@angular/core';
import { BaServerLinkModel } from "./baServerLink.model";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class BaServerLinkService {
  private state: BaServerLinkModel;
  private subject: Subject<BaServerLinkModel> = new Subject<BaServerLinkModel>();

  constructor() {
    setTimeout(() => {
      this.checkConnessione();
    }, 2500);

    setInterval(() => {
      this.checkConnessione();
    }, 10000);
  }

  public get stateObserver(): Observable<BaServerLinkModel> {
    return this.subject.asObservable();
  }

  private checkConnessione(): void {
    let connessioneOk = Math.random() > .1;
    let risultavaConnesso = connessioneOk ? Math.random() > .1 : false;
    let istanteInizialeConnessione;

    if (connessioneOk) {
      if (risultavaConnesso && !!this.state) {
        istanteInizialeConnessione = this.state.istanteInizialeConnessione;
      }
      else {
        istanteInizialeConnessione = new Date();
      }
    } else {
      istanteInizialeConnessione = undefined;
    }

    let newState = new BaServerLinkModel(
      connessioneOk,
      istanteInizialeConnessione,
      connessioneOk || !this.state ? new Date() : this.state.istanteUltimaConversazioneRiuscita,
      !connessioneOk || !this.state ? new Date() : this.state.istanteUltimoErrore,
      "Server down",
      Math.random() * 300 + 100,
      Math.random() * 80 + 10
    );

    this.state = newState;
    this.subject.next(newState);
  }
}
