﻿//-----------------------------------------------------------------------
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Eccezioni;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using System;
using System.Collections.Generic;
using System.Linq;

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
        //[JsonConstructor]
        //public ComposizionePartenze(DateTime istante, string codiceFonte, string codice, bool fuoriSede) : base(istante, codiceFonte, codice, "ComposizionePartenza")
        //{
        //    this.Partenza = new Partenza();
        //    this.Componenti = new HashSet<ComponentePartenza>();
        //    this.FuoriSede = fuoriSede;
        //}

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
            bool fuoriSede, Partenza partenza) : base(richiesta, partenza.Mezzo.Codice, istante, codiceFonte, "ComposizionePartenza", partenza.Codice)
        {
            this.Partenza = partenza;
            this.Componenti = new HashSet<ComponentePartenza>();
            this.FuoriSede = fuoriSede;
        }

        /// <summary>
        ///   Restituisce il codice fiscale del capopartenza presente all'interno dei componenti.
        /// </summary>
        public string CodiceFiscaleCapopartenza
        {
            get
            {
                try
                {
                    var componenteCapopartenza = this.Componenti.SingleOrDefault(c => c.Ruoli.Contains(ComponentePartenza.Ruolo.CapoPartenza));

                    if (componenteCapopartenza != null)
                    {
                        return componenteCapopartenza.CodiceFiscale;
                    }

                    return null;
                }
                catch (InvalidOperationException ex)
                {
                    throw new ComposizionePartenzaException("Esiste più di un Capo Partenza", ex);
                }
            }
        }

        /// <summary>
        ///   Restituisce l'insieme dei codici fiscali relativi alla partenza
        /// </summary>
        public ISet<string> CodiciFiscaliComponenti
        {
            get
            {
                return new HashSet<string>(this
                    .Componenti
                    .Select(c => c.CodiceFiscale));
            }
        }

        /// <summary>
        ///   E' la lista dei componenti della partenza
        /// </summary>
        public Partenza Partenza { get; set; }

        public ISet<ComponentePartenza> Componenti { get; set; }

        /// <summary>
        ///   Indica se l'evento si verifica mentre il mezzo è fuori sede o in sede. Questa
        ///   informazione serve al <see cref="ProcessoreStato" /> a calcolare lo stato iniziale in
        ///   cui il mezzo si trova, a partire dall'analisi degli eventi di un mezzo contenuti in
        ///   una singola richiesta.
        /// </summary>
        public bool FuoriSede { get; private set; }

        /// <summary>
        ///   Restituisce il numero di componenti della <see cref="ComposizionePartenze" />
        /// </summary>
        public int NumeroComponenti
        {
            get
            {
                return this.Componenti.Count;
            }
        }

        /// <summary>
        ///   Restituisce i codici dei mezzi coinvolti in questo evento
        /// </summary>
        public ISet<string> CodiciMezzo
        {
            get
            {
                return new HashSet<string>(this.Componenti
                    .Select(c => c.CodiceMezzo)
                    .Where(cm => cm != null)
                    .Distinct());
            }
        }

        public bool PartenzaAnnullata
        {
            get; set;
        } = false;

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
