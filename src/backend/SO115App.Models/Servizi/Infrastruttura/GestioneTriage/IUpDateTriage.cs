using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTriage
{
    public interface IUpDateTriage
    {
        public void UpDate(UpDateTriageCommand addTriageCommand);
    }
}
