import { Component, OnInit, Input } from '@angular/core';
import { Utente } from 'src/app/shared/model/utente.model';

@Component({
  selector: 'app-lista-utenti',
  templateUrl: './lista-utenti.component.html',
  styleUrls: ['./lista-utenti.component.css']
})
export class ListaUtentiComponent implements OnInit {

  @Input() utenti: Utente[];

  constructor() { }

  ngOnInit() {
    console.log('Utenti', this.utenti);
  }

}
