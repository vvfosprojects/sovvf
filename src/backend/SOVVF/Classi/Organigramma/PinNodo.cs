//-----------------------------------------------------------------------
// <copyright file="PinNodo.cs" company="CNVVF">
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
namespace Modello.Classi.Organigramma
{
    /// <summary>
    ///   Seleziona un nodo dell'organigramma ed, eventualmente, il relativo sottoalbero.
    /// </summary>
    public class PinNodo
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceUnitaOperativa">Il codice dell'unità operativa indicata</param>
        /// <param name="ricorsivo">Indica se si considera l'intero sottoalbero ricorsivamente</param>
        public PinNodo(string codiceUnitaOperativa, bool ricorsivo = false)
        {
            this.Codice = codiceUnitaOperativa;
            this.Ricorsivo = ricorsivo;
        }

        /// <summary>
        ///   E' il codice dell'unità operativa
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Indica se il selettore include anche l'intero sottoalbero avente per radice l'unità
        ///   operativa indicata da <see cref="Codice" />.
        /// </summary>
        public bool Ricorsivo { get; set; }

        /// <summary>
        ///   Un selettore è uguale ad un altro Nodo se hanno lo stesso <see cref="Codice" /> e lo
        ///   stesso <see cref="Ricorsivo" />.
        /// </summary>
        /// <param name="obj">Oggetto da confrontare</param>
        /// <returns>true se il nodo passato è uguale</returns>
        public override bool Equals(object obj)
        {
            if (!(obj is PinNodo))
            {
                return false;
            }

            var n = (PinNodo)obj;
            return n.Codice.Equals(this.Codice);
        }

        /// <summary>
        ///   Restituisce l'hascode del codice unità operativa
        /// </summary>
        /// <returns>Hashcode dell'istanza</returns>
        public override int GetHashCode()
        {
            return this.Codice.GetHashCode() ^
                this.Ricorsivo.GetHashCode();
        }
    }
}
