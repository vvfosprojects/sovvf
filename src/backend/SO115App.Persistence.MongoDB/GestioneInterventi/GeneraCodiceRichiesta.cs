using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class GeneraCodiceRichiesta : IGeneraCodiceRichiesta
    {
        private readonly DbContext _dbContext;

        public GeneraCodiceRichiesta(DbContext dbContext) => _dbContext = dbContext;

        public string Genera(string codiceProvincia, int anno)
        {
            int maxNumero = GetMaxCodiceIntervento(codiceProvincia);

            string returnFormatString = string.Format("{0}-{1}-{2:D5}", codiceProvincia.Split('.')[0], anno, maxNumero);

            return returnFormatString;
        }

        public string GeneraCodiceChiamata(string codiceProvincia, int anno)
        {
            string data = DateTime.Now.ToString("ddMMyyy");
            int maxNumero = GetMaxCodiceChiamata(codiceProvincia);

            string returnString = string.Format("{0}-{1}-{2:D5}", codiceProvincia.Split('.')[0], data, maxNumero);

            return returnString;
        }

        private int GetMaxCodiceIntervento(string codiceSede)
        {
            int MaxIdSintesi = 1;
            var codiceProvincia = codiceSede.Split('.')[0];

            var ListaRichieste = _dbContext.RichiestaAssistenzaCollection
                .Find(Builders<RichiestaAssistenza>.Filter.Empty)
                .ToList()
                .Where(x => x.Codice.IndexOf(codiceProvincia) != -1);

            if (ListaRichieste.Any())
            {
                var codiceRichiesta = ListaRichieste.OrderByDescending(x => x.CodRichiesta).FirstOrDefault().CodRichiesta;

                if (codiceRichiesta != null)
                    MaxIdSintesi = Convert.ToInt16(codiceRichiesta.Substring(codiceRichiesta.Length - 5)) + 1;
            }

            return MaxIdSintesi;
        }

        private int GetMaxCodiceChiamata(string codiceSede)
        {
            int MaxIdSintesi = 1;
            var codiceProvincia = codiceSede.Split('.')[0];

            var ListaRichieste = _dbContext.RichiestaAssistenzaCollection
                .Find(Builders<RichiestaAssistenza>.Filter.Empty)
                .ToList()
                .Where(x => x.Codice.IndexOf(codiceProvincia) != -1);

            if (ListaRichieste.Any())
            {
                string codice = ListaRichieste.OrderByDescending(x => x.IstanteRicezioneRichiesta).FirstOrDefault().Codice;
                MaxIdSintesi = Convert.ToInt16(codice.Substring(codice.Length - 5)) + 1;
            }

            return MaxIdSintesi;
        }
    }
}
