using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.SostituzionePartenza;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaCommand
    {
        public SostituzioneDTO sostituzione { get; set; }

        public RichiestaAssistenza Richiesta { get; set; }
    }
}
