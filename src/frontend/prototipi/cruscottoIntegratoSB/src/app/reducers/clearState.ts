import { ActionReducerMap } from '@ngrx/store';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { State } from "./index";
import * as fromUserLoginSuccess from './userLoginSuccess';
import * as fromRoot from '../reducers';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {
      console.log('state', state);
      console.log('action', action);
  
      return reducer(state, action);
    }
  }

  export const metaReducers: MetaReducer<any>[] = [debug];
