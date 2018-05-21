import { Component, OnInit } from '@angular/core';
import { ChatRowComponent } from "../chat-row/chat-row.component";
import { chat_msg } from "../model/chat_msg";
import { TimeAgoPipe } from "ngx-moment";
import 'moment/locale/de';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    
    myDate: Date;
    
    constructor() {
        this.myDate = new Date();
    }

    righe_chat:chat_msg[] = [
        {messaggio: "ciao1", username: "pippo", orario:"10 minuti fa"},
        {messaggio: "ciao2", username: "pluto", orario:"20 minuti fa"},
        {messaggio: "ciao3", username: "paperino", orario:"30 minuti fa"}
    ];

    ngOnInit() {
       
    }


}
