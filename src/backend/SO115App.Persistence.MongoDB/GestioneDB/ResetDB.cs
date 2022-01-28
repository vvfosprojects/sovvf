using Persistence.MongoDB;
using SO115App.Models.Servizi.Infrastruttura.GestioneDB;

namespace SO115App.Persistence.MongoDB.GestioneDB
{
    public class ResetDB : IResetDB
    {
        private readonly DbContext _dbContext;

        public ResetDB(DbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        bool IResetDB.Reset()
        {
            try
            {
                //if (!_dbContext.DeleteDB("richiesteAssistenza"))
                //    return false;

                //if (!_dbContext.DeleteDB("chiamateInCorso"))
                //    return false;

                //if (!_dbContext.DeleteDB("statoMezzo"))
                //    return false;

                //if (!_dbContext.DeleteDB("statoSquadra"))
                //    return false;

                //if (!_dbContext.DeleteDB("trasferimentiChiamate"))
                //    return false;

                //if (!_dbContext.DeleteDB("composizioneMezzi"))
                //    return false;

                //if (!_dbContext.DeleteDB("composizioneSquadre"))
                //    return false;

                //if (!_dbContext.DeleteDB("unitaOperative"))
                //    return false;

                //if (!_dbContext.DeleteDB("emergenza"))
                //    return false;

                if (!_dbContext.DeleteDB("schedecontatto"))
                    return false;

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
