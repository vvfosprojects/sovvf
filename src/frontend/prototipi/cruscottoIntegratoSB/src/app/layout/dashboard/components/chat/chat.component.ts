import { Component, OnInit } from '@angular/core';
import { ChatRowComponent } from "../chat-row/chat-row.component";
import { chat_msg } from "../model/chat_msg";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    constructor() {
        
    }

    righe_chat:chat_msg[] = [
        {messaggio: "ciao1", username: "pippo", orario:"10 minuti fa"},
        {messaggio: "ciao2", username: "pluto", orario:"20 minuti fa"},
        {messaggio: "ciao3", username: "paperino", orario:"30 minuti fa"}
    ];

    ngOnInit() {
       
    }


}
