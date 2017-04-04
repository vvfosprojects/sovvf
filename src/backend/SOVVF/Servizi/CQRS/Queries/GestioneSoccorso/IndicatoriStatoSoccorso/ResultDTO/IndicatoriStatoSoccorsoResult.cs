//-----------------------------------------------------------------------
// <copyright file="IndicatoriStatoSoccorsoResult.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
// </copyright>
//-----------------------------------------------------------------------
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
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO
{
    /// <summary>
    ///   Contiene gli indicatori sullo stato del soccorso
    /// </summary>
    public class IndicatoriStatoSoccorsoResult
    {
        /// <summary>
        ///   E' il numero di richieste di assistenza non prese in carico
        /// </summary>
        public int NumeroRichiesteInAttesa { get; set; }

        /// <summary>
        ///   E' il numero di richieste di assistenza sospese
        /// </summary>
        /// <remarks>
        ///   Le richieste sospese sono quelle alle quali sono state sottratte tutte le risorse per
        ///   causa di forza maggiore e risultano non presidiate
        /// </remarks>
        public int NumeroRichiesteSospese { get; set; }

        /// <summary>
        ///   E' il numero di richieste prese in carico e non ancora chiuse
        /// </summary>
        public int NumeroRichiesteInCorso { get; set; }

        /// <summary>
        ///   E' il numero dei mezzi sul posto per le richieste
        /// </summary>
        public int NumeroMezziSoccorsoImpegnati { get; set; }

        /// <summary>
        ///   E' il numero dei mezzi in viaggio per le richieste
        /// </summary>
        public int NumeroMezziSoccorsoInViaggio { get; set; }

        /// <summary>
        ///   E' il numero dei mezzi in rientro per le richieste
        /// </summary>
        public int NumeroMezziSoccorsoInRientro { get; set; }

        /// <summary>
        ///   E' il numero totale dei mezzi correntemente disponibili adibiti al soccorso
        /// </summary>
        public int NumeroTotaleMezziSoccorso { get; set; }

        /// <summary>
        ///   E' il numero delle squadre impegnate su una richiesta
        /// </summary>
        public int NumeroSquadreSoccorsoImpegnate { get; set; }

        /// <summary>
        ///   E' il numero totale delle squadre correntemente disponibili adibite al soccorso
        /// </summary>
        public int NumeroTotaleSquadreSoccorso { get; set; }
    }
}
