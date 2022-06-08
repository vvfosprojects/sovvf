using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneTriage
{
    internal class GetTriageData : IGetTriageData
    {
        private readonly DbContext _dBContext;

        public GetTriageData(DbContext dBContext)
        {
            _dBContext = dBContext;
        }

        List<TriageData> IGetTriageData.GetTriageData(GetTriageQuery getTriageQuery)
        {
            return _dBContext.TriageDataCollection.Find(c => getTriageQuery.CodiceSede.Contains(c.CodiceSede) && c.CodDettaglioTipologia.Equals(getTriageQuery.CodDettaglioTipologia) && c.CodTipologia.Equals(getTriageQuery.CodTipologia)).ToList();
        }
    }
}
