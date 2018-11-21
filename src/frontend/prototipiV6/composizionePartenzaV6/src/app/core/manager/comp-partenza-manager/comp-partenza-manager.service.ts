import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PreAccoppiato } from 'src/app/composizione-partenza/model/pre-accoppiato.model';
import { DispatcherCompPartenzaService } from '../../dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';

@Injectable({
  providedIn: 'root'
})
export class CompPartenzaManagerService {
  private newPreAccoppiatieList$ = new Subject<PreAccoppiato[]>();

  constructor(private compPartenzaDispatcher: DispatcherCompPartenzaService) { }

  getPreAccoppiati() {
    this.newPreAccoppiatieList$.next();
    this.compPartenzaDispatcher.onNewPreAccoppiatiList()
      .subscribe({
        next: data => {
          this.newPreAccoppiatieList$.next(data);
        },
        error: data => console.log(`Errore: + ${data}`)
      });
    return this.newPreAccoppiatieList$.asObservable();
  }

  onNewPreAccoppiatiList() {
    return;
  }
}
