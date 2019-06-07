//-----------------------------------------------------------------------
// <copyright file="Revoca.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Classe astratta che modella la revoca nell'uso di un mezzo da parte di una
    ///   <see cref="RichiestaAssistenza" />. Si specializza nei suoi casi concreti (per es.
    ///   intervento non più necessario).
    /// </summary>
    public abstract class Revoca : AbstractPartenza
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public Revoca(
            RichiestaAssistenza richiesta,
            string codiceMezzo,
            DateTime istante,
            string codiceFonte) : base(richiesta, codiceMezzo, istante, codiceFonte)
        {
        }

        /// <summary>
        ///   Metodo di visita
        /// </summary>
        /// <param name="stato">Lo stato da visitare</param>
        /// <returns>Il nuovo stato a seguito della transizione di stato</returns>
        public override IStatoMezzo Visit(ICanAcceptVisitorStatoMezzo stato)
        {
            return stato.AcceptVisitor(this);
        }
    }
}
