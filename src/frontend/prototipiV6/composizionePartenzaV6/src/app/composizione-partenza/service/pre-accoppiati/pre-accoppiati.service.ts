import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PreAccoppiato } from '../../model/pre-accoppiato.model';

@Injectable({
  providedIn: 'root'
})
export class PreAccoppiatiService {
  private preAccoppiatiSelezionati = new Subject<PreAccoppiato[]>();
  preAccoppiatiSelezionatiArray: PreAccoppiato[] = [];
  newArrayPreAccoppiati = [];

  constructor() { }

  // PreAccoppiati selezionati
  sendPreAccoppiatoSelezionato(preAccoppiato: PreAccoppiato) {
    let count = 0;
    this.preAccoppiatiSelezionatiArray.forEach(preAcc => {
      if (preAccoppiato === preAcc) {
        count++;
        console.log('trovato');
      }
    });
    if(count === 0) {
      this.preAccoppiatiSelezionatiArray.push(preAccoppiato);
      this.preAccoppiatiSelezionati.next(this.preAccoppiatiSelezionatiArray);
    }else{
      this.sendPreAccoppiatoDeselezionato(preAccoppiato);
    }
  }
  clearPreAccoppiatiSelezionati() {
    this.preAccoppiatiSelezionati.next();
  }
  sendPreAccoppiatoDeselezionato(preAccoppiato: PreAccoppiato) {
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
