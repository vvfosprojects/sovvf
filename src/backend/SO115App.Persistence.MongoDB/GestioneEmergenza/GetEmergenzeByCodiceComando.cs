using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    public class GetEmergenzeByCodiceComando : IGetEmergenzeByCodComando
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetEmergenzeByCodiceComando(DbContext dbContext, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<Emergenza> Get(string codSede)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();
            pinNodi.Add(new PinNodo(codSede, true));

            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            var arrayCodiciSede = pinNodi.Select(n => n.Codice).ToArray();

            var ListaEmergenze = _dbContext.EmergenzaCollection.Find(Builders<Emergenza>.Filter.Empty).ToList();

            return ListaEmergenze.FindAll(c => arrayCodiciSede.Any(s => s.Contains(c.CodComandoRichiedente) && !c.Annullata));
        }
    }
}
