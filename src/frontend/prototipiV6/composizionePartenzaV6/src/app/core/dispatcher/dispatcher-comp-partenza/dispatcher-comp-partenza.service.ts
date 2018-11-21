import { Injectable } from '@angular/core';
import { PreAccoppiato } from 'src/app/composizione-partenza/model/pre-accoppiato.model';
import { Subject } from 'rxjs';
import { CompPartenzaService } from '../../service/comp-partenza-service/comp-partenza.service';

@Injectable({
  providedIn: 'root'
})
export class DispatcherCompPartenzaService {
  private newPreaccoppiatiList$ = new Subject<PreAccoppiato[]>();

  constructor(private preaccoppiatiService: CompPartenzaService) { }

  onNewPreAccoppiatiList() {
      this.newPreaccoppiatiList$.next();
      this.preaccoppiatiService.getPreAccoppiati()
          .subscribe({
              next: data => this.newPreaccoppiatiList$.next(data),
              error: data => console.log(`Errore: + ${data}`)
          });
      return this.newPreaccoppiatiList$.asObservable();
  }
}
