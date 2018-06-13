import { Component, OnInit, Input } from '@angular/core';
import { chat_msg } from "../model/chat_msg";
import { Globals } from "../model/globals";
import { TimeAgoPipe } from "ngx-moment";
import 'moment/locale/de';

@Component({
  selector: 'app-chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss'],
  
})
export class ChatRowComponent implements OnInit {
  myDate: Date;
  @Input() chatmsg: chat_msg;
  
   constructor(private globals: Globals) {
  }

  ngOnInit() {
  }

}
