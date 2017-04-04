using System.Collections.Generic;
using Modello.Classi.Organigramma;

namespace Modello.Servizi.Infrastruttura.Organigramma
{
    public interface IGetNodiFigliPerCodiceUnitaOperativa
    {
        IEnumerable<UnitaOperativa> Get(string nodo);
    }
}
