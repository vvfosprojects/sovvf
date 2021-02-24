﻿//-----------------------------------------------------------------------
// <copyright file="Mezzo.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Gac;

namespace SO115App.API.Models.Classi.Condivise
{
    public class Mezzo
    {
        public Mezzo() { }

        public Mezzo(string codice, string descrizione, string genere, string stato,
                     string appartenenza, Sede distaccamento, Coordinate coordinate)
        {
            this.Codice = codice;
            this.Descrizione = descrizione;
            this.Genere = genere;
            this.Stato = stato;
            this.Appartenenza = appartenenza;
            this.Distaccamento = distaccamento;
            this.Coordinate = coordinate;
        }

        /// <summary>
        ///   Codice del mezzo
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   l'eventuale id della richiesta a cui è associato il mezzo
        /// </summary>
        public string IdRichiesta { get; set; }

        /// <summary>
        ///   Descrizione del mezzo
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Genere del mezzo
        /// </summary>
        public string Genere { get; set; }

        /// <summary>
        ///   Stato del mezzo
        /// </summary>
        public string Stato { get; set; }

        /// <summary>
        ///   Appartenenza del mezzo (su GAC sarebbe la destinazione d'uso).
        /// </summary>
        public string Appartenenza { get; set; }

        /// <summary>
        ///   Indica il distaccamento del mezzo
        /// </summary>
        public Sede Distaccamento { get; set; }

        /// <summary>
        ///   Descrizione dell'appartenenza del mezzo
        /// </summary>
        public string DescrizioneAppartenenza { get; set; }

        /// <summary>
        ///   Descrizione dello stato del mezzo
        /// </summary>
        public string DescrizioneStato { get; set; }

        /// <summary>
        ///   Stato efficenza del mezzo
        /// </summary>
        public int StatoEfficenza { get; set; }

        /// <summary>
        ///   Descrizione dello Stato efficenza del mezzo
        /// </summary>
        public string DescrizioneStatoEfficenza { get; set; }

        /// <summary>
        ///   Indica il livello del carburante del mezzo
        /// </summary>
        public int LivelloCarburante { get; set; }

        /// <summary>
        ///   descrive il livello del carburante del mezzo
        /// </summary>
        public string DescrizioneLivelloCarburante { get; set; }

        /// <summary>
        ///   Indica il livello dell'estinguente del mezzo
        /// </summary>
        public int LivelloEstinguente { get; set; }

        /// <summary>
        ///   descrive il livello dell'estinguente del mezzo
        /// </summary>
        public string DescrizioneLivelloEstinguente { get; set; }

        /// <summary>
        ///   Note eventuali
        /// </summary>
        public string[] Notifiche { get; set; }

        /// <summary>
        ///   Localizzazione del mezzo da Geofleet
        /// </summary>
        public Coordinate Coordinate { get; set; }

        /// <summary>
        ///   identifica l'istante dell'acquisizione coordinate del mezzo
        /// </summary>
        public DateTime? IstanteAcquisizione { get; set; }

        /// <summary>
        ///   identifica l'istante della prenotazione del mezzo
        /// </summary>
        public DateTime? IstantePrenotazione { get; set; }

        /// <summary>
        ///   identifica l'istante della movimentazione del mezzo
        /// </summary>
        public DateTime? IstanteMovimentazione { get; set; }

        /// <summary>
        ///   Se non ho le coordinate di un mezzo su GeoFleet metto le coordinate e metto a true
        ///   questa proprietà
        /// </summary>
        public bool CoordinateFake { get; set; }

        /// <summary>
        /// Definisce se il mezzo è preaccoppiato con le squadre
        /// </summary>
        public bool PreAccoppiato { get; set; } = false;
    }
}
