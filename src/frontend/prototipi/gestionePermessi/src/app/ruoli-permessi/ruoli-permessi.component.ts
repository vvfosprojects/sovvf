import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Permesso } from 'app/model/permesso.model';
import { Ruolo } from 'app/model/ruolo.model';
import { CheckboxModule } from 'primeng/primeng';
import { SituazionePermessiFakeService } from 'app/service/situazione-permessi-fake.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-ruoli-permessi',
  templateUrl: './ruoli-permessi.component.html',
  styleUrls: ['./ruoli-permessi.component.css']
})
export class RuoliPermessiComponent implements OnInit {
  //@Input() ruoliDispo: Ruolo[];
  //@Input() permessiDispo: Permesso[];
  @Output() permessiDaAssegnare: EventEmitter<string[]> = new EventEmitter<string[]>();
  
  ruoliSelezionati : string[] = [];
  permessiSelezionati : string[];
  ruoliPermessi : string[];
  ruoliDispo: Ruolo[];
  permessiDispo: Permesso[];
    
  constructor(private situazionePermessiService: SituazionePermessiFakeService) { }

  ngOnInit() {
    this.situazionePermessiService.getSituazionePermessi()
            .subscribe(data => {
                this.ruoliDispo = data.ruoliDisponibili;
                console.log(this.ruoliDispo);
                this.permessiDispo = data.permessiDisponibili;
                console.log(this.permessiDispo);
            });
  }
  
  selezionaPermessi(event, ruoloSel: Ruolo) {
    console.log(event);
    console.log(ruoloSel);

    if (event){
      ruoloSel.codiciPermessi.forEach(key => {
        //this.permessiSelezionati.push(ruoloSel.codiciPermessi[key]);
        console.log("ruoloSel :" + ruoloSel.codiciPermessi[key]);
        console.log("key :" + key);
        console.log("permessiSelezionati :" + this.permessiSelezionati);
        //console.log(key);
      });
      this.permessiDaAssegnare.emit(this.permessiSelezionati);
      console.log(this.permessiSelezionati);
    } else {
      this.permessiSelezionati = null; 
      this.permessiDaAssegnare.emit(this.permessiSelezionati);
      console.log("permessi selezionati : " + this.permessiSelezionati);
    }
    
  }

  salvaRuoliPermessi() {
    this.permessiDaAssegnare.emit(this.permessiSelezionati);
    console.log(this.permessiSelezionati);
    
  }
}
