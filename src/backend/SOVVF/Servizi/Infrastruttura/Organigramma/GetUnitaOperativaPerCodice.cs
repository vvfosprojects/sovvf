using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Organigramma;

namespace Modello.Servizi.Infrastruttura.Organigramma
{
    /// <summary>
    ///   Implementa l'interfaccia <see cref="IGetUnitaOperativaPerCodice" /> attraverso una mappa
    ///   immutabile costruita mediante accesso al servizio <see cref="IGetUnitaOperativaRadice" />.
    /// </summary>
    internal class GetUnitaOperativaPerCodice : IGetUnitaOperativaPerCodice
    {
        /// <summary>
        ///   La mappa immutabile contenente l'associazione <see cref="UnitaOperativa.Codice" />
        ///   =&gt; <see cref="UnitaOperativa" />
        /// </summary>
        private readonly Dictionary<string, UnitaOperativa> mappaUnitaOperativePerCodice;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="getUnitaOperativaRadice">
        ///   Il servizio per l'accesso all' <see cref="UnitaOperativa" /> radice.
        /// </param>
        public GetUnitaOperativaPerCodice(IGetUnitaOperativaRadice getUnitaOperativaRadice)
        {
            this.mappaUnitaOperativePerCodice = getUnitaOperativaRadice.Get()
                .GetSottoAlbero()
                .ToDictionary(key => key.Codice, value => value);
        }

        /// <summary>
        ///   Restituisce l' <see cref="UnitaOperativa" /> avente il codice dato.
        /// </summary>
        /// <param name="codice">Il codice dell' <see cref="UnitaOperativa" />.</param>
        /// <returns>L' <see cref="UnitaOperativa" />.</returns>
        public UnitaOperativa Get(string codice)
        {
            return this.mappaUnitaOperativePerCodice[codice];
        }
    }
}
