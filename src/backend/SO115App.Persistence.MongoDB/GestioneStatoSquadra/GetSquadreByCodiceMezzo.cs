using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneStatoSquadra
{
    public class GetSquadreByCodiceMezzo : IGetSquadraByCodiceMezzo
    {
        private DbContext _dbContext;

        public GetSquadreByCodiceMezzo(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   metodo della classe che effettua la query
        /// </summary>
        /// <param name="codiceSede">opzionale, rappresenta il codice sede delle squadre</param>
        /// <returns>una lista di stati operativi</returns>
        public List<StatoOperativoSquadra> Get(string codiciMezzo)
        {
            return _dbContext.StatoSquadraCollection.Find(x => x.CodMezzo.Equals(codiciMezzo)).ToList();
        }
    }
}
