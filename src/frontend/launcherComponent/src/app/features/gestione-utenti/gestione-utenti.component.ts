import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestione-utenti.component.html',
  styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit {

  utenti: any[];
  ricercaUtenti: string;

  constructor() { }

  ngOnInit() {
    this.utenti = [];
  }

}
