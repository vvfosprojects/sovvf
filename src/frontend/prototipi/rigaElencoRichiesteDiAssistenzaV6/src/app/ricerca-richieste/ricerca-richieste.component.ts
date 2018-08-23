import { Component, OnInit, Input } from '@angular/core';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';

@Component({
  selector: 'app-ricerca-richieste',
  templateUrl: './ricerca-richieste.component.html',
  styleUrls: ['./ricerca-richieste.component.scss']
})
export class RicercaRichiesteComponent implements OnInit {
  @Input() richiesteFiltrate: SintesiRichiesta[];
  text : string;

  constructor() { }

  ngOnInit() {
  }

  search(){
    console.log(this.text);
    console.log(this.richiesteFiltrate);
  }
}
