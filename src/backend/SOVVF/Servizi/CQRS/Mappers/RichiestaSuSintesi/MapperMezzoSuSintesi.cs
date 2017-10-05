//-----------------------------------------------------------------------
// <copyright file="MapperMezzoSuSintesi.cs" company="CNVVF">
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
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi
{
    /// <summary>
    ///   Servizio di mapping di un mezzo sul DTO della sintesi richiesta di assistenza
    /// </summary>
    internal class MapperMezzoSuSintesi
    {
        /// <summary>
        ///   Metodo di mapping sul DTO sintesi richiesta
        /// </summary>
        /// <param name="codice">Il codice del mezzo</param>
        /// <param name="stato">Lo stato corrente del mezzo</param>
        /// <returns>Il DTO del mezzo</returns>
        public Mezzo Map(string codice, IStatoMezzo stato)
        {
            return new Mezzo()
            {
                Codice = codice,
                StatoMezzo = stato.Codice,
                DescrizioneStato = stato.Descrizione,
#warning Continuare il mapping facendo affidamento su un servizio di accesso all'anagrafica mezzo
            };
        }
    }
}
