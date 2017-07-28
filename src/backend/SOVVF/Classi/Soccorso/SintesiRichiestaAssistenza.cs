//-----------------------------------------------------------------------
// <copyright file="SintesiRichiestaAssistenzaResult.cs" company="CNVVF">
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
using Modello.Classi.Geo;

namespace Modello.Classi.Soccorso
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza
    /// </summary>
    public class SintesiRichiestaAssistenza
    {
        /// <summary>
        ///   E' il codice della Richiesta di Assistenza
        /// </summary>
        public string CodiceRichiesta { get; set; }

        public DateTime DataOraRichiesta { get; set; }
        public DateTime DataOraPrimaAssegnazione { get; set; }
        public string StatoRichiesta { get; set; }
        public string PrioritaDecodificata { get; set; }
        public IList<string> Tipologie { get; set; }

        // da Segnalazione
        public string Motivazione { get; set; }

        // da Telefonata
        public string Richiedente { get; set; }

        public string NumeroTelefono { get; set; }
        public IList<string> Squadre { get; set; }
        public IList<string> Mezzi { get; set; }
        public IList<string> Persone { get; set; }

        public string Indirizzo { get; set; }
#warning l'Indirizzo non è presente in nessuna classe

        public Geolocalizzazione Geolocalizzazione { get; set; }
#warning nel Dominio front end dovrà essere replicata la stessa struttura di classi Geolocalizzazioe

        public DateTime DataOraPresaInCarico { get; set; }
        public string CodiceSchedaContatto { get; set; }
        public IList<string> DistaccamentiCompentenza { get; set; }

        //
    }
}
