using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie
{
    public interface IGetListaDettaglioTipologia
    {
        public List<TipologiaDettaglio> Get(DettaglioTipologiaQuery query);
    }
}
