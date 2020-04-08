//-----------------------------------------------------------------------
// <copyright file="AbstractPartenza.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Classe astratta che modella il comportamento di default di un evento partenza che
    ///   coinvolge un solo mezzo.
    /// </summary>
    public abstract class AbstractPartenza : Evento, IPartenza
    {
        [JsonConstructor]
        public AbstractPartenza(
            DateTime istante,
            string codiceFonte,
            string codice,
            string codiceMezzo,
            string TipoEvento) : base(istante, codiceFonte, codice, TipoEvento)
        {
            this.CodiceMezzo = codiceMezzo;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public AbstractPartenza(
            RichiestaAssistenza richiesta,
            string codiceMezzo,
            DateTime istante,
            string codiceFonte,
            string TipoEvento) : base(richiesta, istante, codiceFonte, TipoEvento)
        {
            if (string.IsNullOrWhiteSpace(codiceMezzo))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(codiceMezzo));
            }

            this.CodiceMezzo = codiceMezzo;
        }

        /// <summary>
        ///   E' l'identificativo del mezzo a cui è associato l'evento
        /// </summary>
        public string CodiceMezzo { get; private set; }

        /// <summary>
        ///   Restituisce i codici dei mezzi coinvolti in questo evento
        /// </summary>
        ISet<string> IPartenza.CodiciMezzo
        {
            get
            {
                return new HashSet<string> { this.CodiceMezzo };
            }
        }

        /// <summary>
        ///   Metodo di visita del visitor.
        /// </summary>
        /// <param name="stato">Lo stato da visitare</param>
        /// <returns>
        ///   Restituisce lo stato raggiunto a seguito della visita da parte dell'evento
        ///   <see cref="IPartenza" /> visitor.
        /// </returns>
        public abstract IStatoMezzo Visit(ICanAcceptVisitorStatoMezzo stato);
    }
}
