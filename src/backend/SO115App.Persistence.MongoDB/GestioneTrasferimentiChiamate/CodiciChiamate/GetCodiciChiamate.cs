using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Persistence.MongoDB;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.CodiciChiamate;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneTrasferimentiChiamate.CodiciChiamate
{
    public class GetCodiciChiamate : IGetCodiciChiamate
    {
        private readonly DbContext _dbContext;
        public GetCodiciChiamate(DbContext dbContext) => _dbContext = dbContext;

        public List<string> Get(string CodSede)
        {
            return _dbContext.RichiestaAssistenzaCollection.AsQueryable()
                .Where(c => c.TestoStatoRichiesta == "C" && c.CodSOCompetente == CodSede)
                .Select(c => c.Codice)
                .ToList();
        }
    }
}
