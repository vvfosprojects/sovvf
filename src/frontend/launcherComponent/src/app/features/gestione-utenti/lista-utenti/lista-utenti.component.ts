import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lista-utenti',
  templateUrl: './lista-utenti.component.html',
  styleUrls: ['./lista-utenti.component.css']
})
export class ListaUtentiComponent implements OnInit {

  @Input() utenti: any[];

  constructor() { }

  ngOnInit() {
  }

}
