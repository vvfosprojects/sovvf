//-----------------------------------------------------------------------
// <copyright file="SaveRichiestaDiAssistenza_Fake.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso
{
    /// <summary>
    ///   Servizio fake di salvataggio di una richiesta di assistenza
    /// </summary>
    internal class SaveRichiestaDiAssistenza_Fake : ISaveRichiestaAssistenza
    {
        /// <summary>
        ///   Assegna un codice e un'unità operativa competente se il codice non è presente
        /// </summary>
        /// <param name="richiestaAssistenza">La richiesta da salvare</param>
        public void Save(RichiestaAssistenza richiestaAssistenza)
        {
            if (string.IsNullOrWhiteSpace(richiestaAssistenza.Codice))
            {
                richiestaAssistenza.Codice = Guid.NewGuid().ToString();
                richiestaAssistenza.CodiceUnitaOperativaCompetente = "RM";
            }
        }
    }
}
