using Persistence.MongoDB;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneTriage
{
    public class AddTriage : IAddTriage
    {
        private readonly DbContext _dBContex;

        public AddTriage(DbContext dBContex)
        {
            _dBContex = dBContex;
        }

        public void Add(AddTriageCommand addTriageCommand)
        {
            _dBContex.TriageCollection.InsertOne(addTriageCommand.Triage);
            _dBContex.TriageDataCollection.InsertMany(addTriageCommand.ListaTriageData);
        }
    }
}
