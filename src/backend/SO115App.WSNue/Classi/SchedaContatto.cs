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

namespace SO115App.WSNue.Classi.NUE
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
        public string codiceScheda { get; set; }

        /// <summary>
        ///   E' la data inserimento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public DateTime dataInserimento { get; set; }

        /// <summary>
        ///   Indica il codice del comando al quale è stata associata la Scheda Contatto
        /// </summary>
        public string codiceSede { get; set; }

        /// <summary>
        ///   E' il richiedente della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Richiedente richiedente { get; set; }

        /// <summary>
        ///   E' la localita della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Localita localita { get; set; }

        /// <summary>
        ///   E' la classificazione dell'evento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string classificazioneEvento { get; set; }

        /// <summary>
        /// Ovverride della classificazione standard. Ad esempio se in un incidente stradale vi
		///sono feriti, la competenza passa automaticamente al servizio di Emergenza Sanitaria
        ///anche se la macro classificazione rimane "incidente stradale".
        /// </summary>
        public string attributoClassificazione { get; set; }

        /// <summary>
        ///   E' la categoria della scheda contatto, proveniente e valorizzata dal NUE.
        /// </summary>
        public string categoria { get; set; }

        /// <summary>
        ///   Indica l'ente di competenza della scheda contatto.
        /// </summary>
        public string enteCompetenza { get; set; }

        /// <summary>
        ///   E' il dettaglio della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string dettaglio { get; set; }

        /// <summary>
        ///   E' la priorità della scheda contatto, proveniente dal NUE.
        /// </summary>
        public int priorita { get; set; }

        /// <summary>
        ///   E' il numero delle persone coinvolte provenienti dalla scheda contatto, proveniente
        ///   dal NUE.
        /// </summary>
        public int numeroPersoneCoinvolte { get; set; }

        /// <summary>
        ///   Contiente informazioni sull'operatore che gestisce la scheda contatto
        /// </summary>
        public Operatore operatoreChiamata { get; set; }

        /// <summary>
        ///   Indica il tipo di scheda contatto: Competenza, Conoscenza, Differibile
        /// </summary>
        public string classificazione { get; set; }

        /// <summary>
        ///   Indica se la scheda contatto è stata gestita o meno
        /// </summary>
        public bool gestita { get; set; }

        /// <summary>
        ///   Indica se la scheda è stata mergiata all'interno di un altra
        /// </summary>
        public bool collegata { get; set; }

        public List<SchedaContatto> collegate { get; set; }
    }
}
