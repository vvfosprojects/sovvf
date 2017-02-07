// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using System;
using System.Collections.Generic;

namespace Modello.Classi.Soccorso.Squadre
{
    /// <summary>
    ///   Identifica con un Ticket la previsione e l'effettiva disponibilità dei componenti di una
    ///   generica Squadra.
    /// </summary>
    /// <remarks>
    ///   L'insieme delle squadre correntemente disponibili possono essere utilizzate in fase di
    ///   composizione della partenza nell'evasione di una segnalazione.
    /// </remarks>
    public abstract class Squadra
    {
        /// <summary>
        ///   Costruttore della squadra. Inizializza il ticket.
        /// </summary>
        public Squadra()
        {
            this.Ticket = Guid.NewGuid().ToString();
        }

        /// <summary>
        ///   Identificativo assegnato alla squadra al momento della sua definizione.
        /// </summary>
        public string Ticket { get; set; }

        /// <summary>
        ///   E' il codice della squadra che la identifica all'interno dell'Unità Organizzativa.
        /// </summary>
        public string Sigla { get; set; }

        /// <summary>
        ///   Unità operativa responsabile della gestione operativa della squadra
        /// </summary>
        public string CodiceUnitaOperativaResponsabile { get; set; }

        /// <summary>
        ///   E' l'istante in cui è previsto che la squadra prenda servizio.
        /// </summary>
        public DateTime IstantePrevistoInizioServizio { get; set; }

        /// <summary>
        ///   E' l'istante in cui è previsto che la squadra termini il servizio.
        /// </summary>
        public DateTime IstantePrevistoFineServizio { get; set; }

        /// <summary>
        ///   E' l'insieme dei componenti della squadra che prenderanno servizio.
        /// </summary>
        public ISet<Componente> ComposizionePrevista { get; set; }

        /// <summary>
        ///   E' l'insieme dei componenti attualmente disponibili nella squadra.
        /// </summary>
        public ISet<Componente> ComposizioneDisponibile { get; set; }
    }
}
