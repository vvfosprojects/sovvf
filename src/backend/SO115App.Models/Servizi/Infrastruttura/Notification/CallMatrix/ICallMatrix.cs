using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.CallMatrix
{
    public interface ICallMatrix
    {
        public void SendMessage(SintesiRichiesta sintesi);
    }
}
