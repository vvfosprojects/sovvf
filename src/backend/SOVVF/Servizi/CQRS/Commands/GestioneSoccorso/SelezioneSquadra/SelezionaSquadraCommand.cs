using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra
{
    /// <summary>
    ///   Oggetto Command per la selezione di una squadra che definisce i parametri necessari
    ///   all'esecuzione del comando di selezione squadra.
    /// </summary>
    public class SelezionaSquadraCommand
    {
        /// <summary>
        ///   Identificativo univoco della squadra.
        /// </summary>
        public string Ticket { get; set; }
    }
}
