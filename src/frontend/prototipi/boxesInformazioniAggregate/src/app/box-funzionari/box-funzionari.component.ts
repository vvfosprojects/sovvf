import { Component, OnInit, Input } from '@angular/core';
import { FunzionariSo } from "app/box-funzionari/funzionari-so.model";


@Component({
  selector: 'box-funzionari',
  templateUrl: './box-funzionari.component.html',
  styleUrls: ['./box-funzionari.component.css']
})
export class BoxFunzionariComponent implements OnInit {

  @Input() funzionari: FunzionariSo[];
  private numero  : number;
  constructor() { }

  ngOnInit() {
  }

 
  public getfunzPresente(): boolean 
  {
   var  presenteFunz : boolean;
  
   presenteFunz = false;
     
     this.funzionari.forEach(c=>  {
      if (c.funzGuardia)
        presenteFunz = true;
      });

    return presenteFunz;
  }

  public getCapoTurnoPresente(): boolean 
  {
   var  presenteCapoTurno : boolean;
    
   presenteCapoTurno = false;
   
     this.funzionari.forEach(c=>  {
      if (c.capoTurno)
      presenteCapoTurno = true;
      });
   
    return presenteCapoTurno;
  }
}
