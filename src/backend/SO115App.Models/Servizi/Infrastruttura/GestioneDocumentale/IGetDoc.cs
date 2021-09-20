using SO115App.Models.Classi.Documentale;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.RicercaElencoDoc;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale
{
    public interface IGetDoc
    {
        public List<DaoDocumentale> Get(GetElencoDocQuery search);

        public DaoDocumentale GetDocById(string id);

        public List<DaoDocumentale> GetDocByCodCategoria(GetElencoDocQuery search);
    }
}
