//-----------------------------------------------------------------------
// <copyright file="MezzoDTO.cs" company="CNVVF">
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

using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
{
    public class MezzoDTO
    {
        /// <summary>
        ///   Codice del mezzo
        /// </summary>
        [JsonPropertyName("codiceMezzo")]
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   Codice del radio trasmittente
        /// </summary>
        [JsonPropertyName("idRadio")]
        public string IdRadio { get; set; }

        /// <summary>
        ///   Codice della sim per il sistema di tracking
        /// </summary>
        public string ICCID { get; set; }

        /// <summary>
        ///   Descrizione del mezzo
        /// </summary>
        [JsonPropertyName("descrizione")]
        public string Descrizione { get; set; }

        /// <summary>
        ///   Genere del mezzo
        /// </summary>
        [JsonPropertyName("genere")]
        public string Genere { get; set; }

        /// <summary>
        ///   Stato del mezzo
        /// </summary>
        [JsonPropertyName("movimentazione")]
        public Movimentazione Movimentazione { get; set; }

        /// <summary>
        ///   Appartenenza del mezzo
        /// </summary>
        //[JsonPropertyName("appartenenza")]
        public string Appartenenza { get; set; }

        /// <summary>
        ///   Indica codice distaccamento del mezzo
        /// </summary>
        [JsonPropertyName("codiceDistaccamento")]
        public string CodiceDistaccamento { get; set; }

        /// <summary>
        ///   Descrizione dell'appartenenza del mezzo
        /// </summary>
        [JsonPropertyName("descrizioneAppartenenza")]
        public string DescrizioneAppartenenza { get; set; }

        /// <summary>
        ///   Descrizione dello stato del mezzo
        /// </summary>
        //public string DescrizioneStato { get; set; }

        /// <summary>
        ///   Stato efficenza del mezzo
        /// </summary>
        public int StatoEfficenza { get; set; }

        /// <summary>
        ///   Descrizione dello Stato efficenza del mezzo
        /// </summary>
        //public string DescrizioneStatoEfficenza { get; set; }

        ///// <summary>
        /////   Indica il livello del carburante del mezzo
        ///// </summary>
        //public int LivelloCarburante { get; set; }

        ///// <summary>
        /////   descrive il livello del carburante del mezzo
        ///// </summary>
        //public string DescrizioneLivelloCarburante { get; set; }

        ///// <summary>
        /////   Indica il livello dell'estinguente del mezzo
        ///// </summary>
        //public int LivelloEstinguente { get; set; }

        ///// <summary>
        /////   descrive il livello dell'estinguente del mezzo
        ///// </summary>
        //public string DescrizioneLivelloEstinguente { get; set; }

        ///// <summary>
        ///// Indica se un mezzo è in servzio di istituto o meno
        ///// </summary>
        [JsonPropertyName("istituto")]
        public bool Istituto { get; set; }
    }
}
