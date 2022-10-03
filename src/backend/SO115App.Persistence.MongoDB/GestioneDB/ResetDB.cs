using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.GestioneDB;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Persistence.MongoDB.GestioneDB
{
    public class ResetDB : IResetDB
    {
        private readonly DbContext _dbContext;

        public ResetDB(DbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        public bool BonificaCodSedeSchedeContatto()
        {
            var indexWildcardTextSearch = new CreateIndexModel<SchedaContatto>(Builders<SchedaContatto>.IndexKeys.Text("$**"));
            List<CreateIndexModel<SchedaContatto>> indexes = new List<CreateIndexModel<SchedaContatto>>();
            indexes.Add(indexWildcardTextSearch);
            _dbContext.SchedeContattoCollection.Indexes.CreateMany(indexes);

            var col = _dbContext.SchedeContattoCollection.Find(s => s.CodiceScheda.Length > 0).ToList();

            try
            {
                Parallel.ForEach(col, scheda =>
                {
                    try
                    {
                        scheda.CodiceSede = scheda.CodiceSede.Split('.')[0];

                        var filter = Builders<SchedaContatto>.Filter.Eq(x => x.CodiceScheda, scheda.CodiceScheda);
                        var result = _dbContext.SchedeContattoCollection.ReplaceOne(filter, scheda);
                    }
                    catch (Exception ex)
                    {
                    }
                });

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool Reset()
        {
            try
            {
                if (!_dbContext.DeleteDB("richiesteAssistenza"))
                    return false;

                if (!_dbContext.DeleteDB("chiamateInCorso"))
                    return false;

                if (!_dbContext.DeleteDB("statoMezzo"))
                    return false;

                if (!_dbContext.DeleteDB("statoSquadra"))
                    return false;

                if (!_dbContext.DeleteDB("trasferimentiChiamate"))
                    return false;

                if (!_dbContext.DeleteDB("composizioneMezzi"))
                    return false;

                if (!_dbContext.DeleteDB("composizioneSquadre"))
                    return false;

                if (!_dbContext.DeleteDB("unitaOperative"))
                    return false;

                if (!_dbContext.DeleteDB("squadre"))
                    return false;

                if (!_dbContext.DeleteDB("concorrenza"))
                    return false;

                //if (!_dbContext.DeleteDB("emergenza"))
                //    return false;

                //if (!_dbContext.DeleteDB("schedecontatto"))
                //    return false;

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ResetUtenti()
        {
            try
            {
                _dbContext.UtenteCollection.DeleteMany(u => !u.Username.Equals("test")
                                                    && !u.Cognome.Equals("TRIONFERA")
                                                    && !u.Cognome.Equals("DRAGONETTI")
                                                    && !u.Cognome.Equals("GIAMMICHELE"));

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
