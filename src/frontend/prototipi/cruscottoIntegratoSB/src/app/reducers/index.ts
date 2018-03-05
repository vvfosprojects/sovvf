// stato dell'applicazione
import * as fromUser from './user';
import { User } from "../login/_models/user";

export interface State {
   // amount: number;
    user: User;
}

export const reducers = {
    user: fromUser.reducer
};

export const getUserState = (state: State) => state.user;