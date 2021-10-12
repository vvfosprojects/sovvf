using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.ESRI;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI
{
    public interface IMappingESRIMessage
    {
        public ESRI_RichiestaMessage Map(SintesiRichiesta richiesta);
    }
}
