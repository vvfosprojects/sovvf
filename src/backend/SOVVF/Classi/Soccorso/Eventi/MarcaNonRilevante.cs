using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi
{
    public class MarcaNonRilevante : Evento
    {
        public MarcaNonRilevante(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string motivazione) : base(richiesta, istante, codiceFonte)
        {
            if (motivazione == null)
                throw new ArgumentNullException(nameof(motivazione));

            this.Motivazione = motivazione;
        }

        public string Motivazione { get; private set; }
    }
}
