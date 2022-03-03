using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.CodaChiamate;

namespace WSSignlR.Hubs
{
    public class ChiamataHub : Hub
    {
        public void NotifyGetBoxInterventi(BoxInterventi boxInterventi, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
        }

        public void SaveAndNotifySuccessChiamata(SintesiRichiesta sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("SaveAndNotifySuccessChiamata", sintesi);
        }

        public void NotifyGetRichiestaMarker(SintesiRichiestaMarker sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyGetRichiestaMarker", sintesi);
        }

        public void NotifyAddChiamateCodaChiamate(CounterNotifica counter, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAddChiamateCodaChiamate", counter);
        }
    }
}