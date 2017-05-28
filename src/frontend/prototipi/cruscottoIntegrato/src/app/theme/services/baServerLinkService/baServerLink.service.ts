import { Injectable, OnInit } from '@angular/core';
import { BaServerLinkModel } from "./baServerLink.model";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs/ReplaySubject";

@Injectable()
export class BaServerLinkService {
  private state: BaServerLinkModel;
  private subject: Subject<BaServerLinkModel> = new ReplaySubject<BaServerLinkModel>();

  constructor() {
    setTimeout(() => {
      this.checkConnessione();

      setInterval(() => {
        this.checkConnessione();
      }, 10000);
    }, 2500);
  }

  public get stateObserver(): Observable<BaServerLinkModel> {
    return this.subject.asObservable();
  }

  private checkConnessione(): void {
    let connessioneOk = Math.random() > .1;
    let risultavaConnesso = connessioneOk ? Math.random() > .1 : false;

    let istanteInizialeConnessione;
    if (connessioneOk) {
      if (risultavaConnesso && !!this.state && this.state.connesso) {
        istanteInizialeConnessione = this.state.istanteInizialeConnessione;
      }
      else {
        istanteInizialeConnessione = new Date();
      }
    } else {
      istanteInizialeConnessione = undefined;
    }

    let istanteUltimaConversazioneRiuscita;
    if (connessioneOk) {
      istanteUltimaConversazioneRiuscita = new Date();
    } else {
      if (!!this.state) {
        istanteUltimaConversazioneRiuscita = this.state.istanteUltimaConversazioneRiuscita;
      } else {
        istanteUltimaConversazioneRiuscita = undefined;
      }
    }

    let istanteUltimoErrore;
    let descrizioneUltimoErrore;
    if (connessioneOk) {
      if (!!this.state) {
        istanteUltimoErrore = this.state.istanteUltimoErrore;
        descrizioneUltimoErrore = this.state.descrizioneUltimoErrore;
      } else {
        istanteUltimoErrore = undefined;
        descrizioneUltimoErrore = undefined;
      }
    } else {
      istanteUltimoErrore = new Date();
      descrizioneUltimoErrore = "Server error";
    }

    let newState = new BaServerLinkModel(
      connessioneOk,
      istanteInizialeConnessione,
      istanteUltimaConversazioneRiuscita,
      istanteUltimoErrore,
      descrizioneUltimoErrore,
      Math.floor(Math.random() * 300 + 100),
      Math.floor(Math.random() * 80 + 10)
    );

    this.state = newState;
    this.subject.next(newState);
  }
}
