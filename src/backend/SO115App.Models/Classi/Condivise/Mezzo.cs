//-----------------------------------------------------------------------
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
namespace SO115App.API.Models.Classi.Condivise
{
    public class Mezzo
    {
        public Mezzo(string Codice, string Descrizione, string Genere, string Stato,
                     int Appartenenza, Sede Distaccamento)
        {
            this.Codice = Codice;
            this.Descrizione = Descrizione;
            this.Genere = Genere;
            this.Stato = Stato;
            this.Appartenenza = Appartenenza;
            this.Distaccamento = Distaccamento;
        }

        /// <summary>
        /// Codice del mezzo
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        /// Descrizione del mezzo
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        /// Genere del mezzo
        /// </summary>
        public string Genere { get; set; }

        /// <summary>
        /// Stato del mezzo
        /// </summary>
        public string Stato { get; set; }

        /// <summary>
        /// Appartenenza del mezzo
        /// </summary>
        public int Appartenenza { get; set; }

        /// <summary>
        /// Indica il distaccamento del mezzo
        /// </summary>
        public Sede Distaccamento { get; set; }

        /// <summary>
        /// Descrizione dell'appartenenza del mezzo
        /// </summary>
        public string DescrizioneAppartenenza { get; set; }

        /// <summary>
        /// Descrizione dello stato del mezzo
        /// </summary>
        public string DescrizioneStato { get; set; }

        /// <summary>
        /// Stato efficenza del mezzo
        /// </summary>
        public int StatoEfficenza { get; set; }

        /// <summary>
        /// Descrizione dello Stato efficenza del mezzo
        /// </summary>
        public string DescrizioneStatoEfficenza { get; set; }

        /// <summary>
        /// Indica il livello del carburante del mezzo
        /// </summary>
        public int LivelloCarburante { get; set; }

        /// <summary>
        /// descrive il livello del carburante del mezzo
        /// </summary>
        public string DescrizioneLivelloCarburante { get; set; }

        /// <summary>
        /// Indica il livello dell'estinguente del mezzo
        /// </summary>
        public int LivelloEstinguente { get; set; }

        /// <summary>
        /// descrive il livello dell'estinguente del mezzo
        /// </summary>
        public string DescrizioneLivelloEstinguente { get; set; }

        /// <summary>
        /// Note eventuali
        /// </summary>
        public string[] Notifiche { get; set; }
    }
}