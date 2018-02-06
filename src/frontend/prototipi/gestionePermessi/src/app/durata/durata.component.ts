import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalendarModule } from 'primeng/primeng';
import { DurataPermesso } from 'app/model/durata-permesso.model';


@Component({
  selector: 'app-durata',
  templateUrl: './durata.component.html',
  styleUrls: ['./durata.component.css']
})
export class DurataComponent implements OnInit {
  @Output() durata : EventEmitter<DurataPermesso> = new EventEmitter<DurataPermesso>();

  it: any;
  minDate: Date;
  dataFine: Date;
  dataInizio: Date;

  dataInizioPermesso: Date;
  dataFinePermesso: Date;
  
  constructor() { }

  ngOnInit() {
    this.it = {
      firstDayOfWeek: 1,
      dayNames: [ "domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato" ],
      dayNamesShort: [ "dom","lun","mar","mer","gio","ven","sab" ],
      dayNamesMin: [ "D","L","M","M","G","V","S" ],
      monthNames: [ "gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre" ],
      monthNamesShort: [ "gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic" ],
      today: 'Oggi',
      clear: 'Cancella'
    }

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let yearMax = year + 10;
    this.minDate = today;
  }

  salvaData() {
    this.durata.emit({dataInizioPermesso : this.dataInizioPermesso, dataFinePermesso : this.dataFinePermesso});

    console.log("dataInizioPermesso " + this.dataInizioPermesso, "dataFinePermesso " + this.dataFinePermesso);
   
  }

}
