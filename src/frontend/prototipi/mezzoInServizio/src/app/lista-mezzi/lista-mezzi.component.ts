import { Component, OnInit } from '@angular/core';
import { ListaMezziService } from "./lista-mezzi.service";
import { MezzoInServizio } from "../mezzoinservizio/mezzoinservizio.model";

@Component({
  selector: 'app-lista-mezzi',
  templateUrl: './lista-mezzi.component.html',
  styleUrls: ['./lista-mezzi.component.css']
})
export class ListaMezziComponent implements OnInit {
  private tuttiIMezzi: MezzoInServizio[];
  private mezzi: MezzoInServizio[];
  private sedi = [];
  private errorMessage: string;

  constructor(private listaMezziService: ListaMezziService) { }

  ngOnInit() {
    this.getMezzi();
  }

  private getMezzi() {
    this.listaMezziService.getMezzi()
      .subscribe(
      mezzi => {
        this.tuttiIMezzi = mezzi;
        this.aggiornaSedi();
        this.aggiornaMezziFiltrati();
      },
      error => this.errorMessage = <any>error
      )
  }

  private aggiornaSedi() {
    this.sedi =
      [
        { nome: "Centrale", count: 2, checked: false },
        { nome: "Tuscolano I", count: 10, checked: false }
      ];

    this.sedi = this.tuttiIMezzi.reduce((v, m) => {
      var el = v.find((elemento) => {
        return elemento.nome === m.descrizioneUnitaOperativa;
      });

      if (!!el) {
        el.count++;
      } else {
        v.push({ nome: m.descrizioneUnitaOperativa, count: 1, checked: false });
      }

      return v;
    }, []);
  }

  private selSede(event, sede) {
    var el = this.sedi.find(x => x.nome === sede.nome);
    el.checked = event.target.checked;
    this.aggiornaMezziFiltrati();
  }

  private aggiornaMezziFiltrati() {
    // se nessuna checbox è spuntata, si vedono tutti i mezzi
    if (this.sedi.every(x => !x.checked)) {
      this.mezzi = this.tuttiIMezzi;
      return;
    }

    // altrimenti si vedono solo quelli delle categorie spuntate
    this.mezzi = this.tuttiIMezzi.filter((m) => {
      var el = this.sedi.find(x => x.nome === m.descrizioneUnitaOperativa);
      console.log(el);
      return el.checked;
    });
  }
}
