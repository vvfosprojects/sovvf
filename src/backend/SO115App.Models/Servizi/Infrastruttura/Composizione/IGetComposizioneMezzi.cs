using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi
{
    public interface IGetComposizioneMezzi
    {
        List<API.Models.Classi.Composizione.ComposizioneMezzi> Get(ComposizioneMezziQuery query);
    }
}
