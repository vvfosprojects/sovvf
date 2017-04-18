using System.Collections.Generic;
using Modello.Classi.Soccorso;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso
{
    public interface IGetRichiestePerSituazioneMezzi
    {
        IEnumerable<RichiestaAssistenza> Get();
    }
}
