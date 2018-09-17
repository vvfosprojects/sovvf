import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { Input } from '@angular/core';

@Component({
  selector: 'app-lista-richieste',
  templateUrl: './lista-richieste.component.html',
  styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
  @Input() richieste: SintesiRichiesta[];

  constructor() { }

  ngOnInit() {
  }

}
