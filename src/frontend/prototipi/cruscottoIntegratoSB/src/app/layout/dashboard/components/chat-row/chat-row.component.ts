import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss'],
  
})
export class ChatRowComponent implements OnInit {
  @Input() messaggio: string = "Default messaggio";
  //nuovo_messaggio: string;

  testoNuovoMessaggio() {
    this.messaggio = "New testo!";
  }

  constructor() {
  // this.nuovo_messaggio = msg;
  // this.nuovo_messaggio ="ciao miao";
    console.log("messaggio chat inoltrato ");
   }

  ngOnInit() {
  }

}
