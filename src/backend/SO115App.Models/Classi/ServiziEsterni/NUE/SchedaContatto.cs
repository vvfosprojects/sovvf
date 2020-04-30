//-----------------------------------------------------------------------
// <copyright file="SchedaContatto.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Classi.NUE
{
    /// <summary>
    ///   E' l'estratto della scheda contatto che giunge dal NUE.
    /// </summary>
    public class SchedaContatto
    {
        public string id { get; set; }

        /// <summary>
        ///   E' il codice della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string CodiceScheda { get; set; }

        /// <summary>
        ///   E' la data inserimento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public DateTime DataInserimento { get; set; }

        /// <summary>
        ///   E' il richiedente della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Richiedente Richiedente { get; set; }

        /// <summary>
        ///   E' la localita della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Localita Localita { get; set; }

        /// <summary>
        ///   E' la classificazione dell'evento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string ClassificazioneEvento { get; set; }

        /// <summary>
        ///   E' la categoria della scheda contatto, proveniente e valorizzata dal NUE.
        /// </summary>
        public string Categoria { get; set; }

        /// <summary>
        ///   Indica l'ente di competenza della scheda contatto.
        /// </summary>
        public string EnteCompetenza { get; set; }

        /// <summary>
        ///   E' il dettaglio della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string Dettaglio { get; set; }

        /// <summary>
        ///   E' la priorità della scheda contatto, proveniente dal NUE.
        /// </summary>
        public int Priorita { get; set; }

        /// <summary>
        ///   E' il numero delle persone coinvolte provenienti dalla scheda contatto, proveniente
        ///   dal NUE.
        /// </summary>
        public int NumeroPersoneCoinvolte { get; set; }

        /// <summary>
        ///   Contiente informazioni sull'operatore che gestisce la scheda contatto
        /// </summary>
        public Operatore OperatoreChiamata { get; set; }

        /// <summary>
        ///   Indica il tipo di scheda contatto: Competenza, Conoscenza, Differibile
        /// </summary>
        public string Classificazione { get; set; }

        /// <summary>
        ///   Indica se la scheda contatto è stata gestita o meno
        /// </summary>
        public bool Gestita { get; set; }

        /// <summary>
        ///   Indica se la scheda è stata mergiata all'interno di un altra
        /// </summary>
        public bool Collegata { get; set; }

        public List<SchedaContatto> Collegate { get; set; }
    }
}
