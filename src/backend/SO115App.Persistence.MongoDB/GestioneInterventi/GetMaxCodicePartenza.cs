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

        /// <summary>
        /// IL MINIMO E' ZERO E NON VA CAMBIATO, POICHE' LA FUNZIONE TORNA IL MASSIMO
        /// </summary>
        /// <returns></returns>
        public int GetMax()
        {
            var lstRichieste = _ctx.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Ne(r => r.TestoStatoRichiesta, "C")).ToList();

            var lstCodici = lstRichieste?.SelectMany(s => s.lstPartenze.Select(p => p.Codice)).ToList();

            return lstCodici.Count > 0 ? lstCodici.Max() : 0;
        }
    }
}
