import { Selector, State, Action, StateContext } from '@ngxs/store';
import {
    CategoriaEnte,
    ResponseAddEnteRubricaInterface,
    ResponseDeleteEnteRubricaInterface,
    ResponseUpdateEnteRubricaInterface,
    EnteInterface
} from 'src/app/shared/interface/ente.interface';
import { ClearFormEnte, GetCategorieEnti, RequestAddEnte, RequestDeleteEnte, RequestUpdateEnte, SetCategorieEnti, SetEnti } from '../../actions/enti/enti.actions';
import { RubricaStateModel } from '../../../../features/rubrica/store/states/rubrica/rubrica.state';
import { EntiService } from '../../../../core/service/enti-service/enti.service';
import { TipoTelefono } from '../../../enum/tipo-telefono.enum';
import { Injectable } from '@angular/core';

export interface EntiStateModel {
    enti: EnteInterface[];
    categorieEnti: CategoriaEnte[];
    enteForm: {
        model?: {
            id: string;
            codice: number;
            descrizione: string;
            ricorsivo: boolean;
            codCategoria: number,
            indirizzo: string,
            cap: string,
            noteEnte: string,
            email: string,
            telefono: string,
            fax: string
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const entiStateDefaults: EntiStateModel = {
    enti: undefined,
    categorieEnti: undefined,
    enteForm: {
        model: {
            id: undefined,
            codice: undefined,
            descrizione: undefined,
            ricorsivo: false,
            codCategoria: undefined,
            indirizzo: undefined,
            cap: undefined,
            noteEnte: undefined,
            email: undefined,
            telefono: undefined,
            fax: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@Injectable()
@State<EntiStateModel>({
    name: 'enti',
    defaults: entiStateDefaults
})

export class EntiState {

    @Selector()
    static enti(state: EntiStateModel): EnteInterface[] {
        return state.enti;
    }

    @Selector()
    static categorieEnti(state: EntiStateModel): CategoriaEnte[] {
        return state.categorieEnti;
    }

    @Selector()
    static formValid(state: EntiStateModel): boolean {
        return state.enteForm.status !== 'INVALID';
    }

    constructor(private entiService: EntiService) {
    }

    @Action(SetEnti)
    setEnti({ patchState }: StateContext<EntiStateModel>, action: SetEnti): void {
        patchState({
            enti: action.enti
        });
    }

    @Action(GetCategorieEnti)
    getCategorieEnti({ dispatch }: StateContext<EntiStateModel>): void {
        this.entiService.getCategorie().subscribe((categorie: CategoriaEnte[]) => {
            dispatch(new SetCategorieEnti(categorie));
        });
    }

    @Action(SetCategorieEnti)
    setCategorieEnti({ patchState }: StateContext<EntiStateModel>, action: SetCategorieEnti): void {
        patchState({
            categorieEnti: action.categorie
        });
    }


    @Action(RequestAddEnte)
    requestAddEnte({ getState, dispatch }: StateContext<EntiStateModel>): void {
        const form = getState().enteForm.model;
        const newEnte = {
            descrizione: form.descrizione,
            ricorsivo: form.ricorsivo,
            codCategoria: form.codCategoria,
            indirizzo: form.indirizzo,
            cap: form.cap,
            noteEnte: form.noteEnte,
            email: form.email,
            telefoni: []
        };

        // telefono
        if (form.telefono) {
            newEnte.telefoni.push(
                {
                    tipo: TipoTelefono.Telefono,
                    numero: form.telefono
                }
            );
        }
        // fax
        if (form.fax) {
            newEnte.telefoni.push(
                {
                    tipo: TipoTelefono.Fax,
                    numero: form.fax
                }
            );
        }

        this.entiService.add(newEnte).subscribe((response: ResponseAddEnteRubricaInterface) => {
                dispatch(new ClearFormEnte());
            }, (error) => dispatch(new ClearFormEnte())
        );
    }


    @Action(RequestUpdateEnte)
    requestUpdateEnte({ getState, dispatch }: StateContext<EntiStateModel>): void {
        const form = getState().enteForm.model;
        const updatedEnte = {
            id: form.id,
            codice: form.codice,
            descrizione: form.descrizione,
            ricorsivo: form.ricorsivo,
            codCategoria: form.codCategoria,
            indirizzo: form.indirizzo,
            cap: form.cap,
            noteEnte: form.noteEnte,
            email: form.email,
            telefoni: []
        };

        // telefono
        if (form.telefono) {
            updatedEnte.telefoni.push(
                {
                    tipo: TipoTelefono.Telefono,
                    numero: form.telefono
                }
            );
        }
        // fax
        if (form.fax) {
            updatedEnte.telefoni.push(
                {
                    tipo: TipoTelefono.Fax,
                    numero: form.fax
                }
            );
        }
        this.entiService.update(updatedEnte).subscribe((response: ResponseUpdateEnteRubricaInterface) => {
                dispatch(new ClearFormEnte());
            }, (error) => dispatch(new ClearFormEnte())
        );
    }

    @Action(RequestDeleteEnte)
    requestDeleteEnte({ setState, dispatch }: StateContext<RubricaStateModel>, action: RequestDeleteEnte): void {
        this.entiService.delete(action.ente).subscribe((response: ResponseDeleteEnteRubricaInterface) => {
        });
    }

    @Action(ClearFormEnte)
    clearFormEnte({ patchState }: StateContext<EntiStateModel>): void {
        patchState({
            enteForm: entiStateDefaults.enteForm
        });
    }
}
