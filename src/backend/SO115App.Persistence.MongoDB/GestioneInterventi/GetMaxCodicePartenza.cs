using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class GetMaxCodicePartenza : IGetMaxCodicePartenza
    {
        private DbContext _ctx;
        public GetMaxCodicePartenza(DbContext ctx) => _ctx = ctx;

        public int GetMax()
        {
            var lstRichieste = _ctx.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList();

            var lstCodici = lstRichieste?.SelectMany(s => s.lstPartenze.Select(p => p.Codice)).ToList();

            return lstCodici.Count > 0 ? lstCodici.Max() : 1;
        }
    }
}
