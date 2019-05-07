//-----------------------------------------------------------------------
// <copyright file="ComponentePartenza.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using SO115App.API.Models.Classi.Soccorso.Squadre;
using System;

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Modella il componente di una partenza, con i suoi ruoli, il mezzo sul quale è collocato e
    ///   la squadra a cui è assegnato
    /// </summary>
    public class ComponentePartenza : Componente
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceFiscale">E' il codice fiscale</param>
        public ComponentePartenza(string codiceFiscale) : base(codiceFiscale)
        {
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceFiscale">Il codice fiscale</param>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        public ComponentePartenza(string codiceFiscale, string codiceMezzo) : base(codiceFiscale)
        {
            if (string.IsNullOrWhiteSpace(codiceMezzo))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(codiceMezzo));
            }

            this.CodiceMezzo = codiceMezzo;
        }

        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="codiceFiscale">E' il codice fiscale</param>
        /// <param name="codiceMezzo">E' il codice del mezzo</param>
        /// <param name="ticket">E' il ticket associato alla squadra a bordo del mezzo</param>
        public ComponentePartenza(string codiceFiscale, string codiceMezzo, string ticket) : this(codiceFiscale, codiceMezzo)
        {
            if (string.IsNullOrWhiteSpace(ticket))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(ticket));
            }

            this.Ticket = ticket;
        }

        /// <summary>
        ///   E' l'identificativo del mezzo
        /// </summary>
        public string CodiceMezzo { get; private set; }

        /// <summary>
        ///   Identificativo assegnato alla squadra al momento della sua definizione. Rappresenta la
        ///   squadra coinvolta nella partenza.
        /// </summary>
        public string Ticket { get; set; }
    }
}