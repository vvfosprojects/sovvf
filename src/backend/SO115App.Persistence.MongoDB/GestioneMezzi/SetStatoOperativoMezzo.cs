﻿using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;

namespace SO115App.Persistence.MongoDB.GestioneMezzi
{
    /// <summary>
    ///   classe che scrive su mongo lo stato operativo del mezzo
    /// </summary>
    public class SetStatoOperativoMezzo : ISetStatoOperativoMezzo
    {
        private readonly DbContext _dbContext;
        private readonly IUpDateRichiestaAssistenza _upDateRichiesta;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getRichiestaByCodice;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext">il contesto del DB</param>
        public SetStatoOperativoMezzo(DbContext dbContext, IUpDateRichiestaAssistenza upDateRichiesta, IGetSintesiRichiestaAssistenzaByCodice getRichiestaByCodice)
        {
            this._dbContext = dbContext;
            this._upDateRichiesta = upDateRichiesta;
            this._getRichiestaByCodice = getRichiestaByCodice;
        }

        /// <summary>
        ///   metodo della classe che si occupa di aggiornare lo stato operativo del mezzo
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <param name="codiceMezzo">il codice del mezzo (sigla.targa)</param>
        /// <param name="statoOperativo">lo stato operativo del mezzo</param>
        /// <param name="idRichiesta">l'id della richiesta a cui è associato il mezzo</param>
        public void Set(string codiceSede, string codiceMezzo, string statoOperativo, string codRichiesta)
        {
            if (statoOperativo.Equals(Costanti.MezzoRientrato) || statoOperativo.Equals(Costanti.MezzoInSede))
            {
                _dbContext.StatoMezzoCollection.DeleteOne(Builders<StatoOperativoMezzo>.Filter.Eq(x => x.CodiceMezzo, codiceMezzo));
            }
            else
            {
                var statoMezzo = new StatoOperativoMezzo
                {
                    CodiceMezzo = codiceMezzo,
                    CodiceSede = codiceSede,
                    CodiceRichiesta = codRichiesta,
                    StatoOperativo = statoOperativo
                };

                _dbContext.StatoMezzoCollection.FindOneAndReplace(Builders<StatoOperativoMezzo>.Filter.Eq(x => x.CodiceMezzo, codiceMezzo), statoMezzo, new FindOneAndReplaceOptions<StatoOperativoMezzo> { IsUpsert = true });
            }
        }
    }
}
