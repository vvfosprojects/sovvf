import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from '../../lista-richieste-manager/lista-richieste-manager.service';
import { RichiestaHoverService } from '../../lista-richieste-service/richiesta-hover-service/richiesta-hover-service.service';
import { MethodTestService } from '../method-test/method-test.service';

@Component({
  selector: 'app-nav-test',
  templateUrl: './nav-test.component.html',
  styleUrls: ['./nav-test.component.css']
})
export class NavTestComponent implements OnInit {
  richieste: SintesiRichiesta[];
  id_richiestaScelta: any;

  constructor(private richiesteManager: ListaRichiesteManagerService,
    private methods: MethodTestService) { }

  ngOnInit() {
    // Restituisce le richieste
    this.richiesteManager.getData().subscribe((richieste: SintesiRichiesta[]) => {
      this.richieste = richieste;
    });
  }

  hover(id_richiesta) {
    if (id_richiesta === 'null') {
      this.id_richiestaScelta = null;
      this.methods.clearHover();
    } else {
      this.id_richiestaScelta = id_richiesta;
      this.methods.hover(this.id_richiestaScelta);
    }
  }

  selezionata() {
    if (this.id_richiestaScelta !== null) {
      this.methods.seleziona(this.id_richiestaScelta);
    }
  }

  deselezionata() {
    this.methods.deselezionaRichiestaSelezionata();
  }

  a() {
    console.log('a');
  }
}
