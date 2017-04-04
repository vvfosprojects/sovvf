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
  @Input() formChiamataModel: FormChiamataModel;

  myForm: FormGroup;
  formRagSoc: FormGroup;


  constructor( @Inject(FormBuilder) private fb: FormBuilder, private fb2: FormBuilder) {
    this.formChiamataModel = new FormChiamataModel();
    this.formChiamataModel.numero_chiamata = "123.4567.890";
    this.formChiamataModel.operatore = "Mario Rossi";
    this.formChiamataModel.scheda_contatto = "123.456.789";
    // this.formChiamataModel.nome = "primo";

  }

  ngOnInit() {
    console.log("ngoninit!");
    this.myForm = this.fb.group({
      //'nome': [this.formChiamataModel.nome],
      //'cognome': [this.formChiamataModel.cognome, Validators.compose([Validators.required, this.validaCognome])],
      'tipo_interv': [this.formChiamataModel.tipo_interv],
      'indirizzo': [this.formChiamataModel.indirizzo],
      'formRagSoc': this.formRagSoc,
      //'ragione_sociale': [this.formChiamataModel.ragione_sociale],
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

    /**
     * il validatore multi campo agisce a livello di gruppo.
     */
    this.formRagSoc = this.fb2.group({
      'nome': [this.formChiamataModel.nome],
      'cognome': [this.formChiamataModel.cognome],
      'ragione_sociale': [this.formChiamataModel.ragione_sociale],
      //'telefono': [this.formChiamataModel.telefono]
    }, { validator: this.validaRichiedente.bind(this) }); 


    //  console.log("fine init nome vale "+this.formChiamataModel.nome);
    console.log('myForm status ' + this.myForm.status);
    console.log('formRagSoc status ' + this.formRagSoc.status);
  }
  

  get formValido(): boolean {
    return this.formRagSoc.valid;
  }

  validaRichiedente(group: FormGroup): { [s: string]: boolean } {
    // var val_telefono = group.controls['telefono'].value;
     var val_nome = group.controls['nome'].value;
     var val_cognome = group.controls['cognome'].value;
     var val_ragione_sociale = group.controls['ragione_sociale'].value;
   /*
     console.log("telfono "+val_telefono);
     console.log("nome "+val_nome);
     console.log("cognome "+val_cognome);
     console.log("val_ragione_sociale "+val_ragione_sociale);

     if (val_telefono || val_nome) 
          console.log("eccomi !");
*/
/*
     var valido = (val_nome !== "pippo");
     console.log("valida richiedetente è NON valido ?"+valido);
*/
    if (val_nome || val_cognome || val_ragione_sociale ) 
      return { campoVuoto: true };
  }

/*
validaCognome(control: FormGroup): { [s: string]: boolean } {
  //    console.log(control.status);
  if (control.value != "AAAA") {
    return { nonAAAA: true };
  }
}
*/

onClickCC(){
  this.formChiamataModel.ragione_sociale = "Carabinieri";
  console.log("onClickCC !!");
  this.formRagSoc.controls['ragione_sociale'].setValue("Carabinieri");
}
onClickPS(){
  this.formChiamataModel.ragione_sociale = "Polizia di Stato";
  this.formRagSoc.controls['ragione_sociale'].setValue("Polizia di Stato");
  console.log("onClickPS !!");

}
onClickSSU(){
  this.formChiamataModel.ragione_sociale = "Servizio Sanitario Urgenze";
  this.formRagSoc.controls['ragione_sociale'].setValue("Servizio Sanitario Urgenze");
  console.log("onClickSSU !!");
}
onClickPM(){
  this.formChiamataModel.ragione_sociale = "Polizia Municipale";
  this.formRagSoc.controls['ragione_sociale'].setValue("Polizia Municipale");
  console.log("onClickPM !!");
}

onSubmit(value: any): void {
  console.log("nome ", value.nome);
  console.log("cognome ", value.cognome);
  console.log("ragione_sociale ", value.ragione_sociale);
  console.log("tipo ", this.myForm.controls.tipo_interv.value);
  console.log("indirizzo value ", this.myForm.controls.indirizzo.value);
  console.log("telefono ", this.myForm.controls.telefono.value);
  console.log("zona_emergenza ", this.myForm.controls.zona_emergenza.value);
  console.log("tag ", this.myForm.controls.tag.value);
  console.log("motivazione ", this.myForm.controls.motivazione.value);
  console.log("note_indirizzo ", this.myForm.controls.note_indirizzo.value);
  console.log("note_pubbliche ", this.myForm.controls.note_pubbliche.value);
  console.log("note_private ", this.myForm.controls.note_private.value);
  
  // let formChiamataModel = new FormChiamataModel();
  
 }
}
