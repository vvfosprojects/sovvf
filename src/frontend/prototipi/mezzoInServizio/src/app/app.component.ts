import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListaMezziService } from "./lista-mezzi//lista-mezzi.service";
import { ModificaStatoService } from "./modifica-stato-mezzo.service";
import { MezzoInServizio } from "./mezzoinservizio/mezzoinservizio.model";
import { ModificaStatoMezzo } from './mezzoinservizio/modifica-stato-mezzo.model';
import { DescStatoMap } from './mezzoinservizio/desc-stato-map.class';
import { environment } from 'environments/environment';
import { MezzoinservizioComponent } from './mezzoinservizio/mezzoinservizio.component';
import { ListaMezziComponent } from './lista-mezzi/lista-mezzi.component';

import {SelectItem} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';
import { GrowlModule, Message } from 'primeng/primeng';
import { Key } from 'protractor';



const API_URL = environment.apiUrl;  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent {
  
  private rispModStato: ModificaStatoMezzo;
  private annModStato : ModificaStatoMezzo = new ModificaStatoMezzo('', '','');
  private errorMessage: string;

  private tipo_win: string = '0';
  
  private  i : number = 0;
 
  msgs: Message[] = [];
  annulla: Message[] = [];
  constructor(private modificaStatoService: ModificaStatoService, private messageService: MessageService) {}

  /**
   * Questo metodo permette di acquisire il codice del Mezzo (codice) e lo Stato modificato (codiceStato) 
   * dal Componente lista-mezzi. Con tali dati viene effettuata la 
   * chiamata al backend di richiesta di aggiornamento dello stato del mezzo.
   */
  private riceviStato(appmodstato : ModificaStatoMezzo) {
      console.log("Dati AppComponent:");
      console.log(appmodstato);
      console.log("riceviStato");
      this.tipo_win = '1';
      this.sendModStatoMezzo(this.rispModStato);
 }


  /**
   * Questo metodo esegue la subscription all'observable del servizio che aggiorna
   * lo stato del mezzo da modificare/annullare. Viene assegnata la risposta all'object 
   * this.rispModStato che contiene anche lo stato precedente del mezzo, per dare
   * la possibilità di Annullare l'operazione all'utente. Nel caso di chiamata per 
   * annullamento dello stato mezzo, il servizio ritorna codiceStatoPrec a null.
   */
  private sendModStatoMezzo(upstato : ModificaStatoMezzo) {
    
    this.modificaStatoService.sendModStatoMezzo(upstato).subscribe(risp => this.rispModStato = risp,
      error => this.errorMessage = error);
      
     console.log("Subscribe");
     console.log(this.rispModStato);

     if (this.tipo_win === '1'){
         
        //  this.msgs.push({id: this.visualizza, severity: 'info', summary: 'Lo stato del mezzo '+this.rispModStato.codice +' è stato aggiornato.', detail:'<a href="#">Annulla</a>'});
       
        this.msgs.push({id: this.i, severity: 'info', summary: 'Lo stato del mezzo '+ this.i +' è stato aggiornato.', detail:'<a href="#">Annulla</a>'});
        this.i++;
        }

    if (this.tipo_win === '2') {
          
      this.annulla.push({id: this.i, severity: 'info', summary: 'Annullamento effettuato.', detail:''});
     
  }
         
    }

   // Effettua l'annullamento dell'aggiornamento dello stato del mezzo.

   private annullare(event) {
     
      this.annModStato.codice          = this.rispModStato.codice;
      this.annModStato.codiceStato     = this.rispModStato.codiceStatoPrec;
      this.annModStato.codiceStatoPrec = null;
      console.log('Prima di annullare stato mezzo');
      console.log(this.annModStato);
      this.tipo_win = '2';

      Object.keys(this.msgs).forEach(key => {
      
        if (this.msgs[key].id === event.message.id) {
        
          setTimeout(() => {
              this.msgs.splice(this.msgs.indexOf(this.msgs[key]), 1);
              }, 500); 
      }
   
    });
     
     this.sendModStatoMezzo(this.annModStato);  
 };




};

    
   
       
   
 
