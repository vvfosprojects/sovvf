import { Component, OnInit } from '@angular/core';
import { BaServerLinkService } from "../../services";
import { BaServerLinkModel } from "../../services/baServerLinkService/baServerLink.model";

@Component({
  selector: 'ba-link-state',
  templateUrl: './baLinkState.component.html',
  styleUrls: ['./baLinkState.component.scss']
})
export class BaLinkState implements OnInit {
  private state: BaServerLinkModel;

  constructor(private serverLinkService: BaServerLinkService) { }

  ngOnInit() {
    this.serverLinkService.stateObserver.subscribe((state) => {
      this.state = state;
    });
  }

  private get dataUltimaConnessione(): string {
    if (!this.state || this.state.istanteInizialeConnessione === undefined)
      return "";

    var hour = this.state.istanteInizialeConnessione.getHours();
    var minute = this.state.istanteInizialeConnessione.getMinutes();
    var second = this.state.istanteInizialeConnessione.getSeconds();

    return ("0" + hour).slice(-2) + '.' + ("0" + minute).slice(-2) + '.' + ("0" + second).slice(-2);
  }
}
