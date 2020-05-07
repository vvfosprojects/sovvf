using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class DeleteChiamataInCorsoByIdUtente : IDeleteChiamataInCorsoByIdUtente
    {
        private readonly DbContext _dbContext;
        private readonly IGetUtenteById _getUtente;

        public DeleteChiamataInCorsoByIdUtente(DbContext dbContext, IGetUtenteById getUtente)
        {
            _dbContext = dbContext;
            _getUtente = getUtente;
        }

        public void Delete(string idUtente)
        {
            var utente = _getUtente.GetUtenteByCodice(idUtente);
            var nominativo = utente.Nome + " " + utente.Cognome;

            _dbContext.ChiamateInCorsoCollection.DeleteOne(Builders<ChiamateInCorso>.Filter.Eq(x => x.DescrizioneOperatore, nominativo));
        }
    }
}
