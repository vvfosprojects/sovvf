import { Component, OnInit } from '@angular/core';
import { ChatRowComponent } from "../chat-row/chat-row.component";
import { chat_msg } from "../model/chat_msg";
import { TimeAgoPipe } from "ngx-moment";
import { HubConnection } from "@aspnet/signalr";
import 'moment/locale/de';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    
    myDate: Date;
    private _hubConnection: HubConnection;
    
    constructor() {
        this.myDate = new Date();
    }

    righe_chat:chat_msg[] = [
        {messaggio: "ciao1", username: "pippo", orario: new Date()},
        {messaggio: "ciao2", username: "pluto", orario: new Date()},
        {messaggio: "ciao3", username: "paperino", orario: new Date()}
    ];

    ngOnInit() {
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
