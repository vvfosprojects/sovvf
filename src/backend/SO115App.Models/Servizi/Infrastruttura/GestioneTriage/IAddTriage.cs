using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTriage
{
    public interface IAddTriage
    {
        public void Add(AddTriageCommand addTriageCommand);
    }
}
