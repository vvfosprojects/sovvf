﻿//-----------------------------------------------------------------------
// <copyright file="FonogrammaInviato.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma
{
    /// <summary>
    ///   Evento che indica l'avvenuto invio di un fonogramma.
    /// </summary>
    public class FonogrammaInviato : Evento, IFonogramma
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public FonogrammaInviato(
            RichiestaAssistenza richiesta,
            DateTime istante,
            string codiceFonte,
            string destinatari,
            string numeroFonogramma,
            string protocolloFonogramma) : base(richiesta, istante, codiceFonte, "FonogrammaInviato")
        {
            this.Destinatari = destinatari;
            this.NumeroFonogramma = numeroFonogramma;
            this.ProtocolloFonogramma = protocolloFonogramma;
        }

        /// <summary>
        ///   Descrive i destinatari a cui deve essere inviato il fonogramma.
        /// </summary>
        public string Destinatari { get; private set; }

        /// <summary>
        ///   Descrive il numero del fonogramma inviato
        /// </summary>
        public string NumeroFonogramma { get; private set; }

        /// <summary>
        ///   Descrive il protocollo del fonogramma inviato
        /// </summary>
        public string ProtocolloFonogramma { get; private set; }
    }
}
