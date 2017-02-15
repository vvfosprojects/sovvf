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

namespace Modello.Servizi.Infrastruttura.Autenticazione
{
    /// <summary>
    ///   Servizio di accesso all'operatore correntemente autenticato nel corrente thread di esecuzione.
    /// </summary>
    public interface IGetOperatoreAutenticato
    {
        /// <summary>
        ///   Restituisce l'operatore autenticato
        /// </summary>
        /// <returns>La username dell'operatore autenticato. Per es.: mario.rossi</returns>
#warning Questo servizio deve restituire una classe Operatore.

        string Get();
    }
}
