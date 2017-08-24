//-----------------------------------------------------------------------
// <copyright file="Rilascio.cs" company="CNVVF">
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
using System.Linq;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Indica il rilascio della <see cref="ComposizionePartenze"></see> da una Richiesta di
    ///   assistenza. (valido da dopo la <see cref="ComposizionePartenze" /> fino a
    ///   <see cref="PartenzaInRientro" /> inclusa)
    /// </summary>
    public abstract class Rilascio : Evento, IPartenza
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public Rilascio(
            RichiestaAssistenza richiesta,
            string codiceMezzo,
            DateTime istante,
            string codiceFonte) : base(richiesta, istante, codiceFonte)
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
                return new HashSet<string>() { this.CodiceMezzo };
            }
        }

        /// <summary>
        ///   Restituisce lo stato che il mezzo assume a seguito del verificarsi dell'evento
        /// </summary>
        /// <returns>Lo stato del mezzo</returns>
        IStatoMezzo IPartenza.GetStatoMezzo()
        {
            return new InViaggio();
        }
    }
}
