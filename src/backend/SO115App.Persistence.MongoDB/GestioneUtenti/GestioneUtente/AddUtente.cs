using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    public class AddUtente : IAddUtente
    {
        private readonly DbContext _dbContext;
        private readonly IGetPersonaleByCF _personaleByCF;

        public AddUtente(DbContext dbContext, IGetPersonaleByCF personaleByCF)
        {
            _dbContext = dbContext;
            _personaleByCF = personaleByCF;
        }

        public void Add(AddUtenteCommand utente)
        {
            var personale = _personaleByCF.Get(utente.CodiceFiscale, utente.CodiceSede).Result;
            //----valorizzo usn e psw fake
            var utenteVVF = new Utente(utente.CodiceFiscale, personale.Nominativo.Split(".")[0], personale.Nominativo.Split(".")[1])
            {
                Ruoli = utente.Ruoli,
                Username = "test",
                Password = "test",
                Sede = utente.CodiceSede
            };

            //----------------------------
            _dbContext.UtenteCollection.InsertOne(utenteVVF);
        }
    }
}
