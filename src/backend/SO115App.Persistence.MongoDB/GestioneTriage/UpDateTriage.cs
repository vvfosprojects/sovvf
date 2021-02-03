using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;

namespace SO115App.Persistence.MongoDB.GestioneTriage
{
    public class UpDateTriage : IUpDateTriage
    {
        private readonly DbContext _dBContex;

        public UpDateTriage(DbContext dBContex)
        {
            _dBContex = dBContex;
        }

        public void UpDate(UpDateTriageCommand upDateTriageCommand)
        {
            var filter = Builders<Triage>.Filter.Eq(s => s.Id, upDateTriageCommand.Triage.Id);

            _dBContex.TriageCollection.ReplaceOne(filter, upDateTriageCommand.Triage);

            if (upDateTriageCommand.ListaTriageData != null)
            {
                foreach (var data in upDateTriageCommand.ListaTriageData)
                {
                    var filterData = Builders<TriageData>.Filter.Eq(s => s.Id, data.Id);
                    _dBContex.TriageDataCollection.ReplaceOne(filterData, data);
                }
            }
        }
    }
}
