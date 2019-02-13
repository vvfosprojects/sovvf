using System.Collections.Generic;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace SO115App.API.Models.Classi.Notifications
{
    public class Notification<T>
    {
        public string userId { get; set; }

		public string message { get; set; }

        public string oraInvio { get; set; }

        public int id { get; set; }

        public T ActionObj { get; set; }

    }
}