using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneMezzo
{
    /// <summary>
    ///   Oggetto Command per la selezione di un mezzo che definisce i parametri necessari
    ///   all'esecuzione del comando di selezione mezzo.
    /// </summary>
    public class SelezionaMezzoCommand
    {
        /// <summary>
        ///   Identificativo univoco del mezzo.
        /// </summary>
        public string CodiceMezzo { get; set; }
    }
}
