import { PaginationInterface } from './pagination.interface';
import { BoxPartenzaPreAccoppiati } from '../../features/home/composizione-partenza/interface/box-partenza-interface';

export interface ListaComposizioneVeloce {
    composizionePreaccoppiatiDataArray: BoxPartenzaPreAccoppiati[];
    pagination: PaginationInterface;
}
