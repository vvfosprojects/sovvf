import { Component, OnInit, Input } from '@angular/core';
import { LayoutMethods } from '../sintesi-richiesta/_layout-methods';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { ListaRichiesteService } from '../../lista-richieste-service/lista-richieste-service.service';

@Component({
  selector: 'app-sintesi-richiesta-sm',
  templateUrl: './sintesi-richiesta-sm.component.html',
  styleUrls: ['./sintesi-richiesta-sm.component.css']
})
export class SintesiRichiestaSmComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;

  methods = new LayoutMethods;

  constructor(private richiesteS: ListaRichiesteService) { }

  ngOnInit() {
  }

  // Ritorna la richiesta nella lista, defissandola
  defissa() {
    this.richiesteS.defissata();
    this.richiesteS.deselezionata();
  }
}
