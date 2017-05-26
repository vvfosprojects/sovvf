import { Injectable } from '@angular/core';
import { BaThemeConfigProvider, colorHelper } from '../../../theme';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DatiBoxRiepilogo, StatoMeteo } from "app/pages/dashboard/pieChart/dati-box-riepilogo.model";

@Injectable()
export class PieChartService {
  private observable: BehaviorSubject<DatiBoxRiepilogo>;

  constructor(private _baConfig: BaThemeConfigProvider) {
    let datiFake = DatiBoxRiepilogo.getFake();
    this.observable = new BehaviorSubject(datiFake);

    this.modificaIndicatori();
  }

  getData(): Observable<DatiBoxRiepilogo> {
    return this.observable.asObservable();
  }

  private modificaIndicatori(): void {
    let datiCorrenti = this.observable.getValue();
    let nextDati = new DatiBoxRiepilogo(
      datiCorrenti.richiesteInCoda,
      datiCorrenti.richiesteInCorso,
      datiCorrenti.erroreBoxRichieste,
      datiCorrenti.mezziImpegnati,
      datiCorrenti.mezziInServizio,
      datiCorrenti.erroreBoxMezzi,
      datiCorrenti.squadreImpegnate,
      datiCorrenti.squadreInServizio,
      datiCorrenti.erroreBoxSquadre,
      datiCorrenti.descrizioneMeteo,
      datiCorrenti.statoMeteo,
      datiCorrenti.erroreBoxMeteo
    );
    nextDati.modificaRandom();
    this.observable.next(nextDati);

    setTimeout(() => {
      this.modificaIndicatori();
    }, 3000);
  }
}
