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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi.DTO
{
    /// <summary>
    ///   Modella il mezzo disponibile
    /// </summary>
    public class MezzoDisponibileDTO
    {
        /// <summary>
        ///   E' l'identificativo del mezzo
        /// </summary>
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   Unità operativa responsabile della gestione operativa del mezzo
        /// </summary>
        public string CodiceUnitaOperativaResponsabile { get; set; }

        /// <summary>
        ///   E' l'istante in cui non è più disponibile il mezzo.
        /// </summary>
        public DateTime? IstanteFineDisponibilita { get; set; }

        /// <summary>
        ///   Indica l'eventuale stato di selezione del Mezzo. Un Mezzo selezionato è disponibile per
        ///   la Composizione Partenza solo all'operatore che ha effettuato la selezione. Risolve la
        ///   contesa della risorsa <see cref="DisponibilitaMezzo" /> con la semantica Test and Set.
        /// </summary>
        public SelezioneMezzo Selezionata { get; private set; }
    }
}
