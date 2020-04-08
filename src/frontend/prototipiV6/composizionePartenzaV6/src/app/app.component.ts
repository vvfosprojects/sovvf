import { Component } from '@angular/core';
import { SintesiRichiesta } from './shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from './core/manager/lista-richieste-manager/lista-richieste-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'composizionePartenzaV6';

  richiestaNuovaPartenza: SintesiRichiesta;

  constructor(private richiesteS: ListaRichiesteManagerService) {
    this.richiesteS.getRichieste().subscribe(richieste => {
      this.richiestaNuovaPartenza = richieste[0];
    });
  }
}
