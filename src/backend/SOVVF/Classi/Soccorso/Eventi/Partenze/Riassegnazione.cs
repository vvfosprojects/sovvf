//-----------------------------------------------------------------------
// <copyright file="Riassegnazione.cs" company="CNVVF">
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

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Modella il rilascio di un mezzo da una richiesta per riassegnazione ad altro intervento
    /// </summary>
    public class Riassegnazione : Rilascio
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="codiceRichiesta">
        ///   Il codice della richiesta alla quale viene riassegnato il mezzo
        /// </param>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public Riassegnazione(string codiceRichiesta, string codiceMezzo, DateTime istante, string codiceFonte) : base(codiceMezzo, istante, codiceFonte)
        {
            if (string.IsNullOrWhiteSpace(codiceRichiesta))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(codiceRichiesta));
            }
        }

        /// <summary>
        ///   E' l'identificativo della Richiesta di Assistenza a cui viene riassegnata la Partenza
        /// </summary>
        public string CodiceRichiesta { get; private set; }
    }
}
