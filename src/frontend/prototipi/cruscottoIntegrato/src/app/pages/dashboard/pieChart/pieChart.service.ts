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
    setInterval(() => {
      this.modificaIndicatori();
    }, 3000);
  }

  getData(): Observable<DatiBoxRiepilogo> {
    return this.observable.asObservable();
  }

  private modificaIndicatori(): void {
    console.log("Updating...");
    let datiCorrenti = this.observable.getValue();
    datiCorrenti.modificaRandom();
    this.observable.next(datiCorrenti);
  }
}
