﻿using SO115App.Models.Classi.ServiziEsterni.AFM;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM
{
    public interface IGetHistoryRichiestaSoccorsoAereo
    {
        StoricoAFM Get(string requestKey);
    }
}
