using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.SignalR.Utility
{
    public class GetSediPartenze
    {
        public List<string> GetFromRichiesta(RichiestaAssistenza richiesta)
        {
            var lista = richiesta.ListaEventi.OfType<ComposizionePartenze>().ToList();

            return lista.FindAll(p => !p.Partenza.PartenzaAnnullata)
                                .Select(p => p.Partenza.Mezzo.Distaccamento.Codice).ToList();
        }

        public List<string> GetFromSintesi(SintesiRichiesta richiesta)
        {
            var lista = richiesta.Eventi.OfType<ComposizionePartenze>().ToList();

            return lista.FindAll(p => !p.Partenza.PartenzaAnnullata)
                                .Select(p => p.Partenza.Mezzo.Distaccamento.Codice).ToList();
        }
    }
}
