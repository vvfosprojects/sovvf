import { Component } from '@angular/core';

import { DndHandlerService } from './compositore/dnd-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor(private dndHandlerService: DndHandlerService) {
    
  }
}
