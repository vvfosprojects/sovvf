import { Component, OnInit } from '@angular/core';
import { PartenzaService } from '../service/partenza/partenza.service';

@Component({
  selector: 'app-slower',
  templateUrl: './slower.component.html',
  styleUrls: ['./slower.component.css']
})
export class SlowerComponent implements OnInit {

  constructor(private partenzaS: PartenzaService) { }

  ngOnInit() {
  }

  changeMode(newMode: string) {
    this.partenzaS.changeViewMode(newMode);
  }
}
