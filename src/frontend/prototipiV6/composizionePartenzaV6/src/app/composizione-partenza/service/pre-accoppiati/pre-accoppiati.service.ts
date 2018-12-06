import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BoxPartenza } from '../../model/box-partenza.model';

@Injectable({
  providedIn: 'root'
})
export class PreAccoppiatiService {
  private preAccoppiatiSelezionati = new Subject<BoxPartenza[]>();
  preAccoppiatiSelezionatiArray: BoxPartenza[] = [];
  newArrayPreAccoppiati = [];

  constructor() { }

  // PreAccoppiati selezionati
  sendPreAccoppiatoSelezionato(preAccoppiato: BoxPartenza) {
    let count = 0;
    this.preAccoppiatiSelezionatiArray.forEach(preAcc => {
      if (preAccoppiato === preAcc) {
        count++;
        console.log('trovato');
      }
    });
    if (count === 0) {
      this.preAccoppiatiSelezionatiArray.push(preAccoppiato);
      this.preAccoppiatiSelezionati.next(this.preAccoppiatiSelezionatiArray);
    } else {
      this.sendPreAccoppiatoDeselezionato(preAccoppiato);
    }
  }
  clearPreAccoppiatiSelezionati() {
    this.preAccoppiatiSelezionati.next();
  }
  sendPreAccoppiatoDeselezionato(preAccoppiato: BoxPartenza) {
    this.newArrayPreAccoppiati = [];
    this.preAccoppiatiSelezionatiArray.forEach(preAcc => {
      if (preAccoppiato !== preAcc) {
        this.newArrayPreAccoppiati.push(preAcc);
      } else {
        console.log('Deselezionato PreAccoppiato: ' + preAccoppiato.id);
      }
    });
    this.preAccoppiatiSelezionatiArray = this.newArrayPreAccoppiati;
    console.log(this.preAccoppiatiSelezionatiArray);
    this.preAccoppiatiSelezionati.next(this.preAccoppiatiSelezionatiArray);
  }
  getPreAccoppiatiSelezionati(): Observable<any> {
    return this.preAccoppiatiSelezionati.asObservable();
  }

}
