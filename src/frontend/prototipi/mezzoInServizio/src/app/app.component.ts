import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListaMezziService } from "./lista-mezzi//lista-mezzi.service";
import { ModificaStatoService } from "./modifica-stato-mezzo.service";
import { MezzoInServizio } from "./mezzoinservizio/mezzoinservizio.model";
import { ModificaStatoMezzo } from './mezzoinservizio/modifica-stato-mezzo.model';
import { DescStatoMap } from './mezzoinservizio/desc-stato-map.class';
import { environment } from 'environments/environment';
import { MezzoinservizioComponent } from './mezzoinservizio/mezzoinservizio.component';
import { ListaMezziComponent } from './lista-mezzi/lista-mezzi.component';

import { TreeModule, TreeNode } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';
import { InputSwitchModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/dialog';
import {BrowserModule} from '@angular/platform-browser'
import  {FormsModule} from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';




const API_URL = environment.apiUrl;  



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  private rispModStato: ModificaStatoMezzo;
  private annModStato : ModificaStatoMezzo = new ModificaStatoMezzo('', '','');
  private errorMessage: string;

  private tipo_win: string;
 
  display: boolean = false;

  

  
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
      this.tipo_win = '1';
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

      //  alert("Lo stato del mezzo "+ this.rispModStato.codiceStato +" é stato aggiornato. "+" Si vuole annullare l'operazione? ");
    
     this.showDialog();
    }

  showDialog() {
       this.display = true;
   }


   private annullare(risposta : string) {
     
   if (risposta == '1') 
   {
      this.annModStato.codice = this.rispModStato.codice;
      this.annModStato.codiceStato = this.rispModStato.codiceStatoPrec;
      this.annModStato.codiceStatoPrec = null;
      console.log('Prima assegnazione');
      console.log(this.annModStato);
      this.tipo_win = '2';
      this.sendModStatoMezzo(this.annModStato); 
      
   }
   this.display = false;
   }


   private statoPrec() : string {
   
    return this.tipo_win;
  } 

  };



    
   
       
   
 
