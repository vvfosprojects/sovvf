using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;

namespace SO115App.Persistence.MongoDB.GestioneTrasferimentiChiamate
{
    public class AddTrasferimento : IAddTrasferimento
    {
        private readonly DbContext _dbContext;
        public AddTrasferimento(DbContext dbContext) => _dbContext = dbContext;


        public void Add(TrasferimentoChiamata trasferimento)
        {
            _dbContext.TrasferimentiChiamateCollection.InsertOne(trasferimento);
        }
    }
}
