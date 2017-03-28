import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormChiamataModel } from './form-chiamata.model';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-form-chiamata',
  templateUrl: './form-chiamata.component.html',
  styleUrls: ['./form-chiamata.component.css']
})
export class FormChiamataComponent implements OnInit {
  @Input() formChiamataModel : FormChiamataModel;

  myForm: FormGroup;

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    this.formChiamataModel = new FormChiamataModel();
    this.formChiamataModel.numero_chiamata = "123.4567.890";
    this.formChiamataModel.operatore = "Mario Rossi";
    this.formChiamataModel.scheda_contatto = "123.456.789";
   // this.formChiamataModel.nome = "primo";

   }

  ngOnInit() {
    console.log("ngoninit!");
    this.myForm = this.fb.group({
      'nome': [this.formChiamataModel.nome],
      'cognome': [this.formChiamataModel.cognome],
      'tipo_interv': [this.formChiamataModel.tipo_interv],
      'indirizzo': [this.formChiamataModel.indirizzo],
      'ragione_sociale': [this.formChiamataModel.ragione_sociale],
      'telefono': [this.formChiamataModel.telefono],
      'zona_emergenza': [this.formChiamataModel.zona_emergenza],
      'tag': [this.formChiamataModel.tag],
      'motivazione': [this.formChiamataModel.motivazione],
      'note_indirizzo': [this.formChiamataModel.note_indirizzo],
      'note_pubbliche': [this.formChiamataModel.note_pubbliche],
      'note_private': [this.formChiamataModel.note_private]

      //,
 //     'cognome': [this.formChiamataModel.cognome, Validators.required],
   //     'indirizzo': [this.formChiamataModel.indirizzo, Validators.compose([Validators.required])],
     //   'motivazione': [this.formChiamataModel.motivazione, Validators.required]
    });
 
    console.log("fine init nome vale "+this.formChiamataModel.nome);
  }

  onClickCC(){
    this.formChiamataModel.ragione_sociale = "Carabinieri";
    console.log("onClickCC !!");    
    this.myForm.controls['ragione_sociale'].setValue("Carabinieri");
  }
  onClickPS(){
    this.formChiamataModel.ragione_sociale = "Polizia di Stato";
    this.myForm.controls['ragione_sociale'].setValue("Polizia di Stato");
    console.log("onClickPS !!");

  }
  onClickSSU(){
    this.formChiamataModel.ragione_sociale = "Servizio Sanitario Urgenze";
    this.myForm.controls['ragione_sociale'].setValue("Servizio Sanitario Urgenze");
    console.log("onClickSSU !!");
  }
  onClickPM(){
    this.formChiamataModel.ragione_sociale = "Polizia Municipale";
    this.myForm.controls['ragione_sociale'].setValue("Polizia Municipale");
    console.log("onClickPM !!");
  }

    onSubmit(value: any): void {
       console.log("nome ", value.nome);
       console.log("cognome ", this.myForm.controls.cognome.value);
       console.log("tipo ", this.myForm.controls.tipo_interv.value);
       console.log("cognome value ", value.cognome);
       console.log("indirizzo value ", value.indirizzo);
       console.log("ragione sociale ", this.myForm.controls.ragione_sociale.value);
       console.log("telefono ", this.myForm.controls.telefono.value);
       console.log("zona_emergenza ", this.myForm.controls.zona_emergenza.value);
       console.log("tag ", this.myForm.controls.tag.value);
       console.log("motivazione ", this.myForm.controls.motivazione.value);
       console.log("note_indirizzo ", this.myForm.controls.note_indirizzo.value);
       console.log("note_pubbliche ", this.myForm.controls.note_pubbliche.value);
       console.log("note_private ", this.myForm.controls.note_private.value);
   // let formChiamataModel = new FormChiamataModel();
   // this.listaPostService.aggiornaPost(post);
  }
}
