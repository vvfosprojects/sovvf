import { Selector, State, Store, Action, StateContext } from '@ngxs/store';
import { Ente } from 'src/app/shared/interface/ente.interface';
import { SetEnti, GetEnti, UpdateEnte, DeleteEnte, AddEnte } from '../../actions/enti/enti.actions';
import { RubricaService } from 'src/app/core/service/rubrica/rubrica.service';
import { StopLoading } from '../../actions/loading/loading.actions';
import { patch, insertItem, removeItem } from '@ngxs/store/operators';

export interface EntiStateModel {
    enti: Array<Ente>;
}

export const entiStateDefaults: EntiStateModel = {
        enti: undefined
};

@State<EntiStateModel>({
    name: 'enti',
    defaults: entiStateDefaults
})

export class EntiState {

    @Selector()
    static enti(state: EntiStateModel) {
        return state.enti;
    }

    constructor(
        private rubricaService: RubricaService
    ) { }

    @Action(SetEnti)
    setEnti({ patchState }: StateContext<EntiStateModel>, action: SetEnti) {
        patchState({ 
            enti: action.enti
        })
    }


    @Action(GetEnti)
    getEnti({ dispatch }: StateContext<EntiStateModel>) {

        this.rubricaService.getEnti().subscribe((response: Ente[]) => {
            dispatch([
                new SetEnti(response),
                new StopLoading()
            ]);
        })
    }

    
    @Action(AddEnte)
    addEnte({ setState }: StateContext<EntiStateModel>, action: AddEnte) {
        this.rubricaService.addEnte(action.ente).subscribe((response: Ente) => {
            setState(
                patch({
                  enti: insertItem<Ente>(response)
                })
              );
        })
    }


    @Action(UpdateEnte)
    updateEnte({ setState }: StateContext<EntiStateModel>, action: UpdateEnte) {
        //todo
    }

    @Action(DeleteEnte)
    deleteEnte({ setState }: StateContext<EntiStateModel>, action: DeleteEnte) {
        setState(
            patch({
                enti: removeItem(id => id === action.idEnte )
            })
          );
        }
    }