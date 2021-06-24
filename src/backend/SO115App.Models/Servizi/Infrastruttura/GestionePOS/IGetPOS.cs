using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestionePOS
{
    public interface IGetPOS
    {
        public List<PosDAO> Get(GetElencoPOSQuery search);

        public PosDAO GetPosById(string id);

        public PosDAO GetPosByCodTipologiaCodDettaglio(GetElencoPOSQuery search);
    }
}
