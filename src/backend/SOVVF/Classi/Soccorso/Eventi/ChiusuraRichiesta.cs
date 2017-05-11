//-----------------------------------------------------------------------
// <copyright file="ChiusuraRichiesta.cs" company="CNVVF">
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

namespace Modello.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Questo evento indica che sono terminate le operazioni di assistenza alla richiesta da parte
    ///   dei VVF. Viene generato per esempio in caso di trasferimento della Richiesta ad altro Ente,
    ///   oppure di chiusura dell'intervento effettuato, di intervento non più necessario, di falso
    ///   allarme, di fine della vigilanza, etc.
    /// </summary>
    public class ChiusuraRichiesta : Evento
    {
        /// <summary>
        ///   Costruttore della classe. A seguito della chiamata, la richiesta risulta chiusa.
        /// </summary>
        /// <param name="richiesta">E' la richiesta alla quale l'evento deve essere aggiunto</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public ChiusuraRichiesta(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte) : base(istante, codiceFonte)
        {
            if (richiesta == null)
            {
                throw new ArgumentNullException(nameof(richiesta));
            }

            richiesta.IstanteChiusura = this.Istante;
        }
    }
}
