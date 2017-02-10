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

namespace Modello.Classi.Soccorso.Squadre
{
    /// <summary>
    ///   Modella il componente di una squadra, con i suoi ruoli
    /// </summary>
    public class Componente
    {
        /// <summary>
        ///   Indica i possibili ruoli con i quali si partecipa ad una partenza.
        /// </summary>
        public enum Ruolo
        {
            /// <summary>
            ///   E' il ruolo del capoPartenza
            /// </summary>
            CapoPartenza,

            /// <summary>
            ///   E' il ruolo dell'autista
            /// </summary>
            Autista,

            /// <summary>
            ///   E' il ruolo base che non implica mansioni speciali
            /// </summary>
            Vigile,

            /// <summary>
            ///   E' il ruolo assegnato al vigile quando effettua servizio in una sede diversa da
            ///   quella di assegnazione
            /// </summary>
            /// <remarks>Il rimpiazzo può essere programmato o non programmato</remarks>
            Rimpiazzo
        }

        /// <summary>
        ///   E' il codice fiscale del membro appartenente alla partenza
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   E' la lista dei ruoli assegnati al soggetto contestualmente alla richiesta in corso
        /// </summary>
        public ISet<Ruolo> Ruoli { get; set; }

        /// <summary>
        ///   Per la classe, un Componente è uguale ad un altro Componente se hanno lo stesso codice fiscale
        /// </summary>
        /// <param name="obj">Oggetto da confrontare</param>
        /// <returns>true se il Componente passato è uguale</returns>
        public override bool Equals(object obj)
        {
            if (!(obj is Componente))
            {
                return false;
            }

            var c = (Componente)obj;
            return c.CodiceFiscale.Equals(this.CodiceFiscale);
        }

        /// <summary>
        ///   Implementato hascode che restituisce l'hascode del codice fiscale
        /// </summary>
        /// <returns>Hashcode della classe</returns>
        public override int GetHashCode()
        {
            return this.CodiceFiscale.GetHashCode();
        }
    }
}
