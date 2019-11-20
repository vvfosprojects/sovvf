using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace SO115App.Persistence.MongoDB
{
    public class SaveRichiesta : ISaveRichiestaAssistenza
    {
        private readonly DbContext _dbContext;

        public SaveRichiesta(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Save(RichiestaAssistenza richiestaAssistenza)
        {
            _dbContext.RichiestaAssistenzaCollection.InsertOne(richiestaAssistenza);
        }
    }
}
