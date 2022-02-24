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

using SO115App.Models.Classi.Utility;
using System;
using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Condivise
{
    public class Mezzo
    {
        public Mezzo()
        { /*IstantiCambiStato = new List<IstanteCambioStato>();*/ }

        public Mezzo(string codice, string descrizione, string genere, string stato,
                     string appartenenza, Sede distaccamento, Coordinate coordinate)
        {
            IstantiCambiStato = new List<IstanteCambioStato>() { new IstanteCambioStato() };
            Codice = codice;
            Descrizione = descrizione;
            Genere = genere;
            Stato = stato;
            Appartenenza = appartenenza;
            Distaccamento = distaccamento;
            Coordinate = coordinate;
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
        ///   Stato efficenza del mezzo
        /// </summary>
        public int StatoEfficenza { get; set; }

        /// <summary>
        ///   Localizzazione del mezzo da Geofleet
        /// </summary>
        public Coordinate Coordinate { get; set; }

        /// <summary>
        ///   Localizzazione del mezzo da Geofleet
        /// </summary>
        public string[] CoordinateStrg { get; set; }

        /// <summary>
        ///   identifica l'istante dell'acquisizione coordinate del mezzo
        /// </summary>
        public DateTime? IstanteAcquisizione { get; set; }

        /// <summary>
        ///   Se non ho le coordinate di un mezzo su GeoFleet metto le coordinate e metto a true
        ///   questa proprietà
        /// </summary>
        public bool CoordinateFake { get; set; }

        /// <summary>
        ///   Definisce se il mezzo è preaccoppiato con le squadre
        /// </summary>
        public bool PreAccoppiato { get; set; } = false;

        public List<IstanteCambioStato> IstantiCambiStato { get; set; } = new List<IstanteCambioStato>();
    }

    public class IstanteCambioStato
    {
        public IstanteCambioStato() => Stato = Costanti.MezzoInSede;

        public IstanteCambioStato(string StatoMezzo, DateTime? IstanteStatoMezzo = null)
        {
            Stato = StatoMezzo;
            Istante = IstanteStatoMezzo;
        }

        public string Stato { get; set; }
        public DateTime? Istante { get; set; }
    }
}
