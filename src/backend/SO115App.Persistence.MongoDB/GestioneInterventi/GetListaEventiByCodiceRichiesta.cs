using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.CQRS.Queries.ListaEventi;
using SO115App.Models.Servizi.Infrastruttura.GetListaEventi;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class GetListaEventiByCodiceRichiesta : IGetListaEventi
    {
        private readonly DbContext _dbContext;

        public GetListaEventiByCodiceRichiesta(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Evento> Get(ListaEventiQuery query)
        {
            return (List<Evento>)_dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Eq(x => x.Id, query.IdRichiesta)).Single().Eventi;
        }
    }
}
