using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    public class GetEmergenzeByCodiceComando : IGetEmergenzeByCodComando
    {
        private readonly DbContext _dbContext;

        public GetEmergenzeByCodiceComando(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Emergenza> Get(string codComando)
        {
            return _dbContext.EmergenzaCollection.Find(Builders<Emergenza>.Filter.Eq(x => x.CodComandoRichiedente, codComando)).ToList();
        }
    }
}
