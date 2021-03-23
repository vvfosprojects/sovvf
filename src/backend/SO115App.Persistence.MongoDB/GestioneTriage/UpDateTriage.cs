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

            if (upDateTriageCommand.Triage.data == null)
                _dBContex.TriageCollection.DeleteOne(filter);
            else
                _dBContex.TriageCollection.ReplaceOne(filter, upDateTriageCommand.Triage);

            if (upDateTriageCommand.ListaTriageData != null)
            {
                var filterDataDelete = Builders<TriageData>.Filter.Eq(s => s.CodDettaglioTipologia, upDateTriageCommand.codDettaglioTipologia);
                filterDataDelete &= Builders<TriageData>.Filter.Eq(s => s.CodTipologia, upDateTriageCommand.CodTipologia);
                filterDataDelete &= Builders<TriageData>.Filter.Eq(s => s.CodiceSede, upDateTriageCommand.Triage.CodiceSede);
                _dBContex.TriageDataCollection.DeleteMany(filterDataDelete);

                foreach (var data in upDateTriageCommand.ListaTriageData)
                {
                    _dBContex.TriageDataCollection.InsertOne(data);
                }
            }
            else
            {
                var filterData = Builders<TriageData>.Filter.Eq(s => s.CodDettaglioTipologia, upDateTriageCommand.codDettaglioTipologia);
                filterData &= Builders<TriageData>.Filter.Eq(s => s.CodTipologia, upDateTriageCommand.CodTipologia);
                filterData &= Builders<TriageData>.Filter.Eq(s => s.CodiceSede, upDateTriageCommand.Triage.CodiceSede);
                _dBContex.TriageDataCollection.DeleteMany(filterData);
            }
        }
    }
}
