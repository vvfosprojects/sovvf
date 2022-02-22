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

using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;

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
        ///   Indica il codice del comando al quale è stata associata la Scheda Contatto
        /// </summary>
        public string CodiceSede { get; set; }

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
        /// Ovverride della classificazione standard. Ad esempio se in un incidente stradale vi
		///sono feriti, la competenza passa automaticamente al servizio di Emergenza Sanitaria
        ///anche se la macro classificazione rimane "incidente stradale".
        /// </summary>
        public string AttributoClassificazione { get; set; }

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
        public OperatoreNue OperatoreChiamata { get; set; }

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

        public Esri_Params esri_params { get; set; }

        /// <summary>
        ///   Contiene il messaggio NUE originale
        /// </summary>
        public InsertSchedaNueRequest msgNue { get; set; }

        /// <summary>
        ///   Contiene il log di tutti gli eventi generati durante l'import della scheda NUE
        /// </summary>
        public List<EventoNue> listaEventiWS { get; set; }

        /// <summary>
        ///   Se la scheda è stata gestita in un intervento qui verrà scritto il numero dell'intervento
        /// </summary>
        public string CodiceInterventoAssociato { get; set; }
    }

    public class EventoNue
    {
        public DateTime istante { get; set; }
        public string descrizione { get; set; }
    }

    public class InsertSchedaNueRequest
    {
        public string enteMittente;
        public string enteDestinatario;
        public string sedeMittente;
        public string sedeDestinataria;
        public string provinciaMittente;
        public string provinciaDestinatario;
        public string schedaContatto;
        public string codiceSede;
    }

    public class Esri_Params
    {
        public int objectId { get; set; }

        public DateTime lastUpdate { get; set; }
    }
}
