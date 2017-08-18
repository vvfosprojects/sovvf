//-----------------------------------------------------------------------
// <copyright file="FiltroRicercaRichiesteAssistenza.cs" company="CNVVF">
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
using System.Collections.Generic;
using Modello.Classi.Geo;
using Modello.Classi.Organigramma;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza
{
    /// <summary>
    ///   Modella il filtro utilizzato per la ricerca di richieste di assistenza
    /// </summary>
    public class FiltroRicercaRichiesteAssistenza
    {
        /// <summary>
        ///   Indica il numero di pagina che si vuole ricevere (la prima pagina ha indice 1)
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        ///   Indica la dimensione di una pagina
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        ///   Le unità operative per cui vengono selezionate le richieste. Se questo riferimento è
        ///   vuoto si assumono le unità operative sulle quali ha visibilità l'utente correntemente autenticato.
        /// </summary>
        public ISet<PinNodo> UnitaOperative { get; set; }

        /// <summary>
        ///   Indica se si vogliono includere le richieste aperte
        /// </summary>
        public bool Aperte { get; set; }

        /// <summary>
        ///   Indica se si vogliono includere le richieste chiuse
        /// </summary>
        public bool Chiuse { get; set; }

        /// <summary>
        ///   Indica se si vogliono includere le chiamate (richieste senza composizione partenza)
        /// </summary>
        public bool Chiamate { get; set; }

        /// <summary>
        ///   Indica se si vogliono includere gli interventi (richieste con almeno una composizione partenza)
        /// </summary>
        public bool Interventi { get; set; }

        /// <summary>
        ///   Indica una chiave di ricerca full-text
        /// </summary>
        public string SearchKey { get; set; }

        /// <summary>
        ///   Indica l'estensione territoriale delle richieste da cercare
        /// </summary>
        public Geolocalizzazione GeoLocalizzazione { get; set; }
    }
}
