using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.RichiestaCreazioneCRA;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza
{
    public interface INotifyRichiestaCraEmergenza
    {
        void Send(RichiestaCreazioneCRACommand emergenza);
    }
}
