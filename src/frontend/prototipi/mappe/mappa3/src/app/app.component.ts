import { Component } from '@angular/core';
import { PuntiDataOutput } from "./service/puntiDataOutput.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PuntiDataOutput]
})

export class AppComponent {
  //title = 'app works!';

  constructor(private puntiDataOutput: PuntiDataOutput) { } 
  
  PuntoOutputTodo(puntoOutput) { 
    this.puntiDataOutput.addPointFromMap(puntoOutput); 
  }

}