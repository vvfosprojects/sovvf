using System.Collections.Generic;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace SO115App.API.Models.Classi.Notifications
{
    public class Notification<T>
    {
        public string CodiceSede {get; set;}
        public string NominativoUtente { get; set; }
        public T ActionObj { get; set; }
        public int idUtente {get; set;}

    }
}