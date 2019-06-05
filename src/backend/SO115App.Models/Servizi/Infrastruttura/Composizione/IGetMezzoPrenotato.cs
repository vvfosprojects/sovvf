using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.MezzoPrenotato;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato
{
    public interface IGetMezzoPrenotato
    {
        ComposizioneMezzi Get(MezzoPrenotatoQuery query);
    }
}
