using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneZoneEmergenza;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneZoneEmergenza
{
    public class GetZoneEmergenza : IGetZoneEmergenza
    {
        private readonly DbContext _dbContext;
        public GetZoneEmergenza(DbContext dbContext) => _dbContext = dbContext;

        public List<string> GetAll()
        {
            try
            {
                var lstRichieste = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList();

                var result = lstRichieste.SelectMany(r => r.CodZoneEmergenza).ToList();

                return result;
            }
            catch (Exception e)
            {
                return new List<string>();
            }
        }
    }
}
