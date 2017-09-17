//-----------------------------------------------------------------------
// <copyright file="InviareFonogramma.cs" company="CNVVF">
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

namespace Modello.Classi.Soccorso.Eventi.Fonogramma
{
    /// <summary>
    ///   Evento che indica la necessità di invio di un fonogramma.
    /// </summary>
    public class InviareFonogramma : Evento, IFonogramma
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        /// <param name="destinatari">Descrive i destinatari a cui deve essere inviato il fonogramma</param>
        public InviareFonogramma(
            RichiestaAssistenza richiesta,
            DateTime istante,
            string codiceFonte,
            string destinatari) : base(richiesta, istante, codiceFonte)
        {
            this.Destinatari = destinatari;
        }

        /// <summary>
        ///   Descrive i destinatari a cui deve essere inviato il fonogramma.
        /// </summary>
        public string Destinatari { get; private set; }
    }
}
