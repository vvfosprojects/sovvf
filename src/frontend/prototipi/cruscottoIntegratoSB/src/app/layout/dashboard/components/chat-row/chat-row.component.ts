import { Component, OnInit, Input } from '@angular/core';
import { chat_msg } from "../model/chat_msg";

@Component({
  selector: 'app-chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss'],
  
})
export class ChatRowComponent implements OnInit {
  @Input() chatmsg: chat_msg;

   constructor() {
  }

  ngOnInit() {
  }

}
