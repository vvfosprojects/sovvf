using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Organigramma;

namespace Modello.Servizi.Infrastruttura.Organigramma
{
    /// <summary>
    ///   Interfaccia del servizio che restituisce l'unità operativa radice dell'organigramma.
    /// </summary>
    public interface IGetUnitaOperativaRadice
    {
        /// <summary>
        ///   Restituisce l'unità operativa radice dell'organigramma
        /// </summary>
        /// <returns>Unità operativa radice</returns>
        UnitaOperativa Get();
    }
}
