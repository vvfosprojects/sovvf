using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.CodiciChiamate;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneTrasferimentiChiamate.CodiciChiamate
{
    public class GetCodiciChiamate : IGetCodiciChiamate
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetCodiciChiamate(DbContext dbContext, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<string> Get(string CodSede)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pinNodi = new List<PinNodo>();

            pinNodi.Add(new PinNodo(CodSede, true));

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            var filtroSediCompetenti = Builders<RichiestaAssistenza>.Filter
                .In(richiesta => richiesta.CodSOCompetente, pinNodi.Select(uo => uo.Codice));

            var lista = _dbContext.RichiestaAssistenzaCollection.Find(filtroSediCompetenti).ToList();

            return lista.Where(c => c.TestoStatoRichiesta == "C")
                   .Select(c => c.Codice).ToList();
        }
    }
}
