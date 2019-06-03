using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.FakePersistenceJSon.Classi;

namespace SO115App.FakePersistenceJSon.Utility
{
    public class MapperDTO
    {
        public static RichiestaAssistenza MapRichiestaDTOtoRichiesta(RichiestaAssistenzaDTO richiesta)
        {
            var richiestaMap = new RichiestaAssistenza()
            {
                Codice = richiesta.Codice,
                CodiceUnitaOperativaCompetente = richiesta.CodiceUnitaOperativaCompetente,
                CodiciUnitaOperativeAllertate = richiesta.CodiciUnitaOperativeAllertate,
                CodiciUOCompetenza = richiesta.CodiciUOCompetenza,
                Competenze = richiesta.Competenze,
                Descrizione = richiesta.Descrizione,
                Geolocalizzazione = richiesta.Geolocalizzazione,
                Localita = richiesta.Localita,
                NumeroRichiedente = richiesta.NumeroRichiedente,
                Operatore = richiesta.Operatore,
                Richiedente = richiesta.Richiedente,
                Tags = richiesta.Tags,
                Tipologie = richiesta.Tipologie,
                ZoneEmergenza = richiesta.ZoneEmergenza
            };

            foreach (Evento evento in richiesta.Eventi)
            {
                richiestaMap.AddEvento(evento);
            }

            return richiestaMap;
        }
    }
}
