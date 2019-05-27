using SO115App.API.Models.Classi.ListaEventi;
using SO115App.API.Models.Servizi.CQRS.Queries.ListaEventi;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GetListaEventi
{
    public interface IGetListaEventi
    {
        List<Eventi> Get(ListaEventiQuery query);
    }
}
