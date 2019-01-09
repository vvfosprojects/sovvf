import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BoxPartenza } from '../../interface/box-partenza-interface';

// Model

@Injectable({
  providedIn: 'root'
})
export class ComposizioneAvanzataService {
  private partenze$: Subject<BoxPartenza[]> = new Subject<BoxPartenza[]>();
  private partenze: BoxPartenza[] = [];

  constructor() {
  }

  nuovaPartenza(partenza: BoxPartenza) {
    this.partenze.push(partenza);
    this.partenze$.next(this.partenze);
  }

  getPartenze(): Observable<BoxPartenza[]> {
    return this.partenze$.asObservable();
  }

  aggiornaPartenze(partenze: BoxPartenza[]) {
    this.partenze = partenze;
    this.partenze$.next(this.partenze);
  }
}
