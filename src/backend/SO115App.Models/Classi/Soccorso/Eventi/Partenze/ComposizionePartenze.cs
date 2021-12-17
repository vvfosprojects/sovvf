//-----------------------------------------------------------------------
// <copyright file="ComposizionePartenze.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using System;

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Questa classe rappresenta l'assegnazione di risorse per l'evasione di una richiesta di
    ///   assistenza. Le risorse sono costituite da componenti con i relativi ruoli, Mezzi e Squadra
    /// </summary>
    /// no
    /// <remarks>
    ///   Questo evento associa il personale all'effettivo mezzo e squadra che interverranno per il
    ///   soccorso. Valuteremo se i mezzi e le attrezzature possono essere ricondotti ad un'unica
    ///   categoria (risorsa strumentale).
    /// </remarks>
    public class ComposizionePartenze : AbstractPartenza, IPartenza
    {
        /// <summary>
        ///   Costruttore che inizializza l'attributo Componenti.
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        /// <param name="fuoriSede">
        ///   Indica se, al momento della composizione, il mezzo è fuori sede o meno
        /// </param>
        public ComposizionePartenze(
            RichiestaAssistenza richiesta,
            DateTime istante,
            string codiceFonte,
            bool fuoriSede, Partenza partenza, Coordinate coordinatePartenza = null) : base(richiesta, partenza.Mezzo.Codice, istante, codiceFonte, "ComposizionePartenza", partenza.Codice)
        {
            Partenza = partenza;
            FuoriSede = fuoriSede;

            Partenza.Cordinate = coordinatePartenza;
        }

        /// <summary>
        ///   E' la lista dei componenti della partenza
        /// </summary>
        public Partenza Partenza { get; set; }

        /// <summary>
        ///   Indica se l'evento si verifica mentre il mezzo è fuori sede o in sede. Questa
        ///   informazione serve al <see cref="ProcessoreStato" /> a calcolare lo stato iniziale in
        ///   cui il mezzo si trova, a partire dall'analisi degli eventi di un mezzo contenuti in
        ///   una singola richiesta.
        /// </summary>
        public bool FuoriSede { get; private set; }

        public bool InviataSTATRI { get; set; }

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
