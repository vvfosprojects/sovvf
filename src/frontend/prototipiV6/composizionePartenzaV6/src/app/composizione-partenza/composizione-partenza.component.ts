import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { Subscription } from 'rxjs';
import { ListaRichiesteManagerService } from '../core/manager/lista-richieste-manager/lista-richieste-manager.service';

@Component({
  selector: 'app-composizione-partenza',
  templateUrl: './composizione-partenza.component.html',
  styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit {
  subscription = new Subscription();

  richiesta: SintesiRichiesta;

  constructor(private listaRichiesteManager: ListaRichiesteManagerService) { 
        // Restituisce le Richieste
        this.subscription.add(
            this.listaRichiesteManager.getRichieste().subscribe(richieste => {
                // console.log('Sono listaRichieste, ho ricevuto le richieste');
                // console.log(richieste);
                this.richiesta = richieste[0];
            })
        );
      }

  ngOnInit() {
  }

  CardClasses(r){
    return;
  }

}
