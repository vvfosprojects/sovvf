//-----------------------------------------------------------------------
// <copyright file="ProcessoreStato.cs" company="CNVVF">
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
using System.Diagnostics;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   Questa classe implementa lo state diagram dei mezzi. Le transizioni di stato avvengono in
    ///   seguito al verificarsi di eventi <see cref="IPartenza" />.
    /// </summary>
    public class ProcessoreStato
    {
        /// <summary>
        ///   Lo stato correntemente tracciato dal processore
        /// </summary>
        private IStatoMezzo stato;

        /// <summary>
        ///   Il costruttore della classe. Lo stato originario è quello di mezzo non assegnato alla richiesta.
        /// </summary>
        public ProcessoreStato()
        {
            this.stato = new FuoriSincro(DateTime.MinValue);
        }

        /// <summary>
        ///   Restituisce lo stato correntemente corrente del processore
        /// </summary>
        public IStatoMezzo Stato
        {
            get { return this.stato; }
        }

        /// <summary>
        ///   Esegue le transizioni di stato processando gli eventi dopo averli ordinati in ordine cronologico.
        /// </summary>
        /// <param name="eventi">Gli eventi che inducono le transizioni di stato</param>
        /// <returns>Il processore</returns>
        public ProcessoreStato ProcessaEventi(IEnumerable<IPartenza> eventi)
        {
            // Asserisce che gli eventi siano ordinati in ordine cronologico
            IPartenza ultimoEvento = null;
            foreach (var e in eventi)
            {
                if (ultimoEvento != null)
                {
                    Debug.Assert(ultimoEvento.Istante <= e.Istante, "Gli eventi non risultano ordinati in ordine crescente");
                }

                ultimoEvento = e;
            }

            foreach (var e in eventi)
            {
                this.stato = this.stato.Transisci(e);
            }

            return this;
        }

        /// <summary>
        ///   Esegue una transizione di stato
        /// </summary>
        /// <param name="evento">L'evento che induce la transizione di stato</param>
        /// <returns>Il processore</returns>
        public ProcessoreStato ProcessaEvento(IPartenza evento)
        {
            this.stato = this.stato.Transisci(evento);

            return this;
        }
    }
}
