using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using System;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.Utility
{
    public class GetMaxCodice
    {
        private readonly DbContext _dbContext;

        public GetMaxCodice(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public int GetMax(string codiceSede)
        {
            int MaxIdSintesi;
            var codiceProvincia = codiceSede.Split('.')[0];

            var ListaRichieste = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList().Where(x => x.Codice.IndexOf(codiceProvincia) != -1);

            if (ListaRichieste.Any())
            {
                var idPRov = ListaRichieste.OrderByDescending(x => x.CodRichiesta).FirstOrDefault().CodRichiesta;
                MaxIdSintesi = Convert.ToInt16(idPRov.Substring(idPRov.Length - 5)) + 1;
            }
            else
                MaxIdSintesi = 0;

            return MaxIdSintesi;
        }

        public int GetMaxCodiceChiamata(string codiceSede)
        {
            int MaxIdSintesi;

            var codiceProvincia = codiceSede.Split('.')[0];
            var ListaRichieste = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList().Where(x => x.Codice.IndexOf(codiceProvincia) != -1);

            if (ListaRichieste.Any())
            {
                string codice = ListaRichieste.OrderByDescending(x => x.IstanteRicezioneRichiesta).FirstOrDefault().Codice;
                MaxIdSintesi = Convert.ToInt16(codice.Substring(codice.Length - 5)) + 1;
            }
            else
            {
                MaxIdSintesi = 0;
            }

            return MaxIdSintesi;
        }
    }
}
