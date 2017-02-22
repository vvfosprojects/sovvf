// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using System.Collections.Generic;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.DTO
{
    /// <summary>
    ///   Modella il membro della squadra disponibile
    /// </summary>
    public class MembroDTO
    {
        /// <summary>
        ///   Codice fiscale del membro
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   Nome del membro
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   Cognome del membro
        /// </summary>
        public string Cognome { get; set; }

        /// <summary>
        ///   Nickname del membro (sarà valorizzato solo in caso di omonimia)
        /// </summary>
        public string Nickname { get; set; }

        /// <summary>
        ///   Qualifica del membro
        /// </summary>
        public string Qualifica { get; set; }

        /// <summary>
        ///   Ruoli che il membro ricopre nella squadra
        /// </summary>
        public ISet<ComponentePartenza.Ruolo> Ruoli { get; set; }

        /// <summary>
        ///   Unità operativa di appartenenza del membro
        /// </summary>
        public string DescrizioneUnitaOperativaDiAppartenenza { get; set; }
    }
}
