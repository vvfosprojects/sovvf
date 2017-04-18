using System;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO
{
    public class SituazioneMezzo
    {
        public string CodiceMezzo { get; set; }
        public IStatoMezzo StatoMezzo { get; set; }
        public string CodiceRichiestaAssistenza { get; set; }
        public DateTime DataAggiornamento { get; set; }
    }
}
