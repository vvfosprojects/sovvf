using Persistence.MongoDB;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    public class GetTipologieEmergenza : IGetTipologieIntervento
    {
        private readonly DbContext _dbContext;

        public GetTipologieEmergenza(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<TipologiaEmergenza> Get()
        {
            throw new NotImplementedException();
        }
    }
}
