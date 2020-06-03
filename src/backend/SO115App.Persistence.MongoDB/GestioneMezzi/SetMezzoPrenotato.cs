using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneMezzi
{
    public class SetMezzoPrenotato : ISetMezzoPrenotato
    {
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly DbContext _dbContext;
        private readonly IGetMezziByCodiceMezzo _getMezziByCodice;

        public SetMezzoPrenotato(IGetStatoMezzi getStatoMezzi, DbContext dbContext, IGetMezziByCodiceMezzo getMezziByCodice)
        {
            _getStatoMezzi = getStatoMezzi;
            _dbContext = dbContext;
            _getMezziByCodice = getMezziByCodice;
        }

        public void Set(SetMezzoPrenotatoCommand command)
        {
            var mezzi = _getStatoMezzi.Get(command.MezzoPrenotato.CodiceSede, command.MezzoPrenotato.CodiceMezzo);
            if (mezzi != null
                && command.MezzoPrenotato.SbloccaMezzo)
            {
                _dbContext.StatoMezzoCollection.FindOneAndDelete(Builders<StatoOperativoMezzo>.Filter.Eq(s => s.CodiceMezzo, command.MezzoPrenotato.CodiceMezzo));
            }
            else if (!command.MezzoPrenotato.SbloccaMezzo)
            {
                command.MezzoPrenotato.StatoOperativo = "In Sede";
                _dbContext.StatoMezzoCollection.InsertOne(command.MezzoPrenotato);
            }
        }
    }
}
