import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-elimina-partenza-modal',
  templateUrl: './elimina-partenza-modal.component.html',
  styleUrls: ['./elimina-partenza-modal.component.css']
})
export class EliminaPartenzaModalComponent implements OnInit {

  targaMezzo: string;
  idRichiesta: string;

  eliminaPartenzaForm: FormGroup;

  motivazioni = [
    {
      codice: '1',
      descrizione: 'Intervento non più necessario'
    },
    {
      codice: '2',
      descrizione: 'Riassegnazione'
    },
    {
      codice: '3',
      descrizione: 'Fuori Servizio'
    },
    {
      codice: '4',
      descrizione: 'Altra motivazione'
    },
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.eliminaPartenzaForm = this.fb.group({
      codMotivazione: ['', Validators.required],
      testoMotivazione: [''],
      codRichiestaSubentrata: [''],
    });
  }

}
