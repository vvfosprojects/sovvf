using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using System.Collections.Generic;


namespace SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati
{
    public interface IGetPreAccoppiati
    {
        List<PreAccoppiati> Get(PreAccoppiatiQuery query);
    }
}

