//-----------------------------------------------------------------------
// <copyright file="GetTipoInterventoByCodice_Fake.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;
using Modello.Servizi.Infrastruttura.Anagrafiche;

namespace SOVVF.FakeImplementations.Modello.Infrastruttura.Anagrafiche
{
    /// <summary>
    ///   Servizio fake che restituisce il tipo intervento a partire dal suo codice
    /// </summary>
    internal class GetTipoInterventoByCodice_Fake : IGetTipoInterventoByCodice
    {
        /// <summary>
        ///   Restituisce il tipo di intervento
        /// </summary>
        /// <param name="codice">Il codice del tipo di intervento richiesto</param>
        /// <returns>Il tipo di intervento fake</returns>
        public TipologiaRichiesta Get(string codice)
        {
            return new TipologiaRichiesta(codice, "Tipologia fake " + codice);
        }
    }
}
