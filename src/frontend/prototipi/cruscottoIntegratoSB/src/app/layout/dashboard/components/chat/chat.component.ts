import { Component, OnInit } from '@angular/core';
import { ChatRowComponent } from "../chat-row/chat-row.component";
import { chat_msg } from "../model/chat_msg";
import { TimeAgoPipe } from "ngx-moment";
import { HubConnection } from "@aspnet/signalr";
import 'moment/locale/de';
import { v4 as uuid } from 'uuid';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    public clientId: string;
    
    myDate: Date;
    private _hubConnection: HubConnection;
    nick = '';
    message = 'client-so-';
    
    constructor() {
        this.myDate = new Date();
    }

    righe_chat:chat_msg[] = [
        {messaggio: "ciao1", username: "pippo", orario: new Date()},
        {messaggio: "ciao2", username: "pluto", orario: new Date()},
        {messaggio: "ciao3", username: "paperino", orario: new Date()}
    ];

    public sendMessage(): void {
        this._hubConnection
          .invoke('sendToAll', this.nick+this.clientId, this.message)
          .then(() => this.message = '')
          .catch(err => console.error(err));
          console.log("messaggio inviato");
      }

    ngOnInit() {

        this.clientId = uuid();

        this._hubConnection = new HubConnection('http://localhost:5000/chat');
        

        this._hubConnection
          .start()
          .then(() => console.log('Connection started!'))
          .catch(err => console.log('Error while establishing connection :('));
    
          this._hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
            console.log("messaggio ricevuto");
            const text = `${nick}: ${receivedMessage}`;
            this.righe_chat.push( {
                messaggio: receivedMessage,
                username: nick,
                orario: new Date()
            });
          });      
       
    }


}
