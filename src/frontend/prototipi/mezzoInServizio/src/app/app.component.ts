import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListaMezziService } from "./lista-mezzi//lista-mezzi.service";
import { ModificaStatoService } from "./modifica-stato-mezzo.service";
import { MezzoInServizio } from "./mezzoinservizio/mezzoinservizio.model";
import { ModificaStatoMezzo } from './mezzoinservizio/modifica-stato-mezzo.model';
import { DescStatoMap } from './mezzoinservizio/desc-stato-map.class';
import { environment } from 'environments/environment';

const API_URL = environment.apiUrl;  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {
  
  private rispModStato: ModificaStatoMezzo;
  private errorMessage: string;
 
  
  constructor(private modificaStatoService: ModificaStatoService) {}

  /**
   * Questo metodo permette di acquisire il codice del Mezzo (codice) e lo Stato modificato (codiceStato) 
   * dal Componente lista-mezzi. Con tali dati viene effettuata la 
   * chiamata al backend di richiesta di aggiornamento dello stato del mezzo.
   */
  private riceviStato(appmodstato : ModificaStatoMezzo) {
      console.log("Dati AppComponent:");
      console.log(appmodstato);
      console.log("riceviStato");
      this.sendModStatoMezzo(this.rispModStato);
  }

  /**
   * Questo metodo esegue la subscription all'observable del servizio che aggiorna
   * lo stato del mezzo da modificare. Viene assegnata la risposta all'object 
   * this.rispModStato che contiene anche lo stato precedente del mezzo, per dare
   * la possibilità di Annullare l'operazione all'utente.
   */
  private sendModStatoMezzo(upstato : ModificaStatoMezzo) {
    this.modificaStatoService.sendModStatoMezzo(upstato).subscribe(risp => this.rispModStato = risp,
      error => this.errorMessage = error);
      
   console.log("Subscribe");
   console.log(this.rispModStato);
   alert("Lo stato del mezzo "+this.rispModStato.codice+" é stato aggiornato. "+" Si vuole annullare l'operazione? ");
   }
  
  }
