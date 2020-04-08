import { Component, OnInit } from '@angular/core';
import { BaServerLinkService } from "../../theme/services";
import { BaServerLinkModel } from "../../theme/services/baServerLinkService/baServerLink.model";

@Component({
  selector: 'link-state',
  templateUrl: './link-state.component.html',
  styleUrls: ['./link-state.component.scss']
})
export class LinkStateComponent implements OnInit {
  private state: BaServerLinkModel;

  constructor(private linkStateService: BaServerLinkService) { 
  }

  ngOnInit() {
    this.linkStateService.stateObserver.subscribe((state) => {
      this.state = state;
    });
  }
}
