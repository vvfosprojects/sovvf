import { PaginationInterface } from './pagination.interface';
import { BoxPartenza } from '../../features/home/composizione-partenza/interface/box-partenza-interface';

export interface ListaComposizioneVeloce {
    composizionePreaccoppiatiDataArray: BoxPartenza[];
    pagination: PaginationInterface;
}
