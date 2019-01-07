import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BoxPartenza } from '../../model/box-partenza.model';

// Model

@Injectable({
  providedIn: 'root'
})
export class ComposizioneAvanzataService {
  private partenze$: Subject<BoxPartenza[]>;
  private partenze: BoxPartenza[] = [];

  constructor() { }

  nuovaPartenza(partenza: BoxPartenza) {
    this.partenze.push(partenza);
    this.partenze$.next(this.partenze);
  }

  getPartenze(): Observable<BoxPartenza[]> {
    return this.partenze$.asObservable();
  }
}
