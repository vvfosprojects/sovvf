using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Emergenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetEmergenzaById
{
    public class GetEmergenzaByIdResult
    {
        public Emergenza emergenza { get; set; }
    }
}
