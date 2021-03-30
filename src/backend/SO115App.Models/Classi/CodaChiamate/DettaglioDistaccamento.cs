using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System.Collections.Generic;

namespace SO115App.Models.Classi.CodaChiamate
{
    public class DettaglioDistaccamento
    {
        public string codDistaccamento { get; set; }
        public string descDistaccamento { get; set; }
        public List<SintesiRichiesta> listaSintesi { get; set; }
        public List<API.Models.Classi.Condivise.Squadra> listaSquadre { get; set; }
    }
}
