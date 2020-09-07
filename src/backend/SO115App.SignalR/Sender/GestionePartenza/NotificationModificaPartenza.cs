using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationModificaPartenza : INotifyModificaPartenza
    {
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetRichiestaById _getRichiesta;
        //private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        public NotificationModificaPartenza(
            IGetRichiestaById getRichiesta,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            //_getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
            _getRichiesta = getRichiesta;
        }

        public async Task SendNotification(ModificaPartenzaCommand command)
        {
            var richiesta = _getRichiesta.GetById(command.ModificaPartenza.CodRichiesta);

            var SediDaNotificare = new List<string>();
            if (richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(richiesta.CodSOCompetente, richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(richiesta.CodSOCompetente);

            foreach (var sede in SediDaNotificare)
            {

            }
        }
    }
}
