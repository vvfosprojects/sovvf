using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;

namespace SO115App.Persistence.MongoDB.GestioneMezzi
{
    /// <summary>
    ///   classe che scrive su mongo lo stato operativo del mezzo
    /// </summary>
    public class SetStatoOperativoMezzo : ISetStatoOperativoMezzo
    {
        private readonly DbContext _dbContext;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext">il contesto del DB</param>
        public SetStatoOperativoMezzo(DbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        /// <summary>
        ///   metodo della classe che si occupa di aggiornare lo stato operativo del mezzo
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <param name="codiceMezzo">il codice del mezzo (sigla.targa)</param>
        /// <param name="statoOperativo">lo stato operativo del mezzo</param>
        /// <param name="idRichiesta">l'id della richiesta a cui è associato il mezzo</param>
        public void Set(string codiceSede, string codiceMezzo, string statoOperativo, string idRichiesta)
        {
            var statoMezzo = new StatoOperativoMezzo
            {
                CodiceMezzo = codiceMezzo,
                CodiceSede = codiceSede,
                CodiceRichiesta = idRichiesta,
                StatoOperativo = statoOperativo
            };
            _dbContext.StatoMezzoCollection.FindOneAndReplace(Builders<StatoOperativoMezzo>.Filter.Eq(x => x.CodiceMezzo, codiceMezzo), statoMezzo, new FindOneAndReplaceOptions<StatoOperativoMezzo> { IsUpsert = true });
        }
    }
}
