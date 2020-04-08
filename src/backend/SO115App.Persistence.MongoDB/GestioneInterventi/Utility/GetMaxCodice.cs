using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.Utility
{
    public class GetMaxCodice
    {
        private readonly DbContext _dbContext;

        public GetMaxCodice(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public int GetMax()
        {
            int MaxIdSintesi;

            var ListaRichieste = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList();

            if (ListaRichieste.FindAll(x => x.CodRichiesta != null).Count > 0)
            {
                var idPRov = ListaRichieste.FindAll(x => x.CodRichiesta != null).OrderByDescending(x => x.CodRichiesta).FirstOrDefault().CodRichiesta;

                MaxIdSintesi = Convert.ToInt16(idPRov.Substring(idPRov.Length - 5)) + 1;
            }
            else
                MaxIdSintesi = 0;

            return MaxIdSintesi;
        }

        public int GetMaxCodiceChiamata()
        {
            int MaxIdSintesi;

            var ListaRichieste = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList();

            if (ListaRichieste.Any())
            {
                string codice = ListaRichieste.OrderByDescending(x => x.Codice).FirstOrDefault().Codice;
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
