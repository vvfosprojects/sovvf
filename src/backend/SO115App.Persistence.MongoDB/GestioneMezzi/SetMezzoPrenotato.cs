using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System;

namespace SO115App.Persistence.MongoDB.GestioneMezzi
{
    public class SetMezzoPrenotato : ISetMezzoPrenotato
    {
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly DbContext _dbContext;

        public SetMezzoPrenotato(IGetStatoMezzi getStatoMezzi, DbContext dbContext)
        {
            _getStatoMezzi = getStatoMezzi;
            _dbContext = dbContext;
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
                _dbContext.StatoMezzoCollection.InsertOne(command.MezzoPrenotato);
            }
        }
    }
}
