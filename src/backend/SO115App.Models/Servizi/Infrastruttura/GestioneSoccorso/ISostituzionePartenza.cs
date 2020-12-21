using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.SostituzionePartenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    /// <summary>
    /// L'interfaccia serve per annullare una partenza e sostituirla con una nuova, creando un nuovo id partenza
    /// </summary>
    public interface ISostituzionePartenza
    {
        RichiestaAssistenza Sostituisci(RichiestaAssistenza richiesta, Sostituzione sostituzione);
    }
}
