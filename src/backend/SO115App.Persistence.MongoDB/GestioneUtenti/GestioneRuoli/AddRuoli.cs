using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class AddRuoli : IAddRuoli
    {
        private readonly DbContext dbContext;

        public AddRuoli(DbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public void Add(string codFiscale, List<Role> ruoli)
        {
            dbContext.UtenteCollection.UpdateOne(Builders<Utente>.Filter.Eq(x => x.CodiceFiscale, codFiscale), Builders<Utente>.Update.AddToSet("ruoli", ruoli));
        }
    }
}
