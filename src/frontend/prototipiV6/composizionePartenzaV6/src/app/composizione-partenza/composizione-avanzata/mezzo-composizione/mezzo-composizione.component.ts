import { Component, OnInit, Input } from '@angular/core';

// Model
import { MezzoComposizione } from '../../model/mezzo-composizione.model';

@Component({
  selector: 'app-mezzo-composizione',
  templateUrl: './mezzo-composizione.component.html',
  styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit {
  @Input() mezzoComp: MezzoComposizione;
  hover = false;

  constructor() { }

  ngOnInit() {
  }

  hoverIn() {
    this.hover = true;
  }

  hoverOut() {
    this.hover = false;
  }
}
