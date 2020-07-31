using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class GetRubrica : IGetRubrica
    {
        private readonly DbContext _dbContext;

        public GetRubrica(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<EnteIntervenuto> Get(string[] CodSede, bool Ricorsivo)
        {
            var lstEnti = _dbContext.RubricaCollection.Find(x => CodSede.Contains(x.CodSede) && x.Ricorsivo == Ricorsivo).ToList();

            var lstCodiciEnti = lstEnti.Select(c => c.Codice.ToString()).ToList();

            var lstTelefoni = _dbContext.TelefoniCollection.Find(x => lstCodiciEnti.Contains(x.Codice)).ToList();

            lstEnti.ForEach(ente => ente.Telefoni = lstTelefoni.Where(t => t.Codice == ente.Codice.ToString()).ToList());

            return lstEnti;
        }
    }
}
