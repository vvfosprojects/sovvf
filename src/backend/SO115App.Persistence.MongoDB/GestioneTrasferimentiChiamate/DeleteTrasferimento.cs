using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;

namespace SO115App.Persistence.MongoDB.GestioneTrasferimentiChiamate
{
    public class DeleteTrasferimento : IDeleteTrasferimento
    {
        private readonly DbContext _dbContext;
        public DeleteTrasferimento(DbContext dbContext) => _dbContext = dbContext;

        public void Delete(string Id)
        {
            _dbContext.TrasferimentiChiamateCollection.FindOneAndDelete(Builders<TrasferimentoChiamata>.Filter.Eq(x => x.Id, Id));
        }
    }
}
