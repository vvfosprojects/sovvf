using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestionePOS
{
    public interface IGetPOS
    {
        public List<DtoPos> Get(GetElencoPOSQuery search);

        public DtoPos GetPosById(string id);
    }
}
