import { Component, OnInit } from '@angular/core';

import { CompositoreService } from '../compositore/compositore.service';

@Component({
  selector: 'app-drop-area',
  templateUrl: './drop-area.component.html',
  styleUrls: ['./drop-area.component.css']
})
export class DropAreaComponent implements OnInit {

  constructor(private compositoreService: CompositoreService) { }

  ngOnInit() {
  }

  public canYouAcceptMezzo(target: any) {
    return true;
  }

  public acceptMezzo(target: any) {
    this.compositoreService.addMezzo(target);
  }
}
