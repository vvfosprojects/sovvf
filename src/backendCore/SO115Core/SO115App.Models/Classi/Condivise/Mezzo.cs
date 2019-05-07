//-----------------------------------------------------------------------
// <copyright file="NonNecessario.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Condivise
{
    public class Mezzo
    {
        public Mezzo(string Codice, string Descrizione, string Genere, string Stato,
                     int Appartenenza, Sede Distaccamento)
        {
            this.codice = Codice;
            this.descrizione = Descrizione;
            this.genere = Genere;
            this.stato = Stato;
            this.appartenenza = Appartenenza;
            this.distaccamento = Distaccamento;
        }

        /// <summary>
        ///   Codice del mezzo
        /// </summary>
        public string codice { get; set; }

        /// <summary>
        ///   Descrizione del mezzo
        /// </summary>
        public string descrizione { get; set; }

        /// <summary>
        ///   Genere del mezzo
        /// </summary>
        public string genere { get; set; }

        /// <summary>
        ///   Stato del mezzo
        /// </summary>
        public string stato { get; set; }

        /// <summary>
        ///   Appartenenza del mezzo
        /// </summary>
        public int appartenenza { get; set; }

        /// <summary>
        ///   Indica il distaccamento del mezzo
        /// </summary>
        public Sede distaccamento { get; set; }

        /// <summary>
        ///  Descrizione dell'appartenenza del mezzo
        /// </summary>
        public string descrizioneAppartenenza { get; set; }

        /// <summary>
        ///  Descrizione dello stato del mezzo
        /// </summary>
        public string descrizioneStato { get; set; }

        /// <summary>
        /// Stato efficenza del mezzo
        /// </summary>
        public int statoEfficenza { get; set; }

        /// <summary>
        /// Descrizione dello Stato efficenza del mezzo
        /// </summary>
        public string descrizioneStatoEfficenza { get; set; }

        /// <summary>
        /// Indica il livello del carburante del mezzo
        /// </summary>
        public int livelloCarburante { get; set; }

        /// <summary>
        /// descrive il livello del carburante del mezzo
        /// </summary>
        public string descrizioneLivelloCarburante { get; set; }

        /// <summary>
        /// Indica il livello dell'estinguente del mezzo
        /// </summary>
        public int livelloEstinguente { get; set; }

        /// <summary>
        /// descrive il livello dell'estinguente del mezzo
        /// </summary>
        public string descrizioneLivelloEstinguente { get; set; }

        /// <summary>
        /// Note eventuali
        /// </summary>
        public string[] notifiche { get; set; }
    }
}