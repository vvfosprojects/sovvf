//-----------------------------------------------------------------------
// <copyright file="MapperRichiestaSuSintesi.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi
{
    /// <summary>
    ///   Implementazione del servizio di mapping di <see cref="RichiestaAssistenza" /> sul DTO <see cref="SintesiRichiesta" />.
    /// </summary>
    internal class MapperRichiestaSuSintesi : IMapperRichiestaSuSintesi
    {
        /// <summary>
        ///   Esegue il mapping di <see cref="RichiestaAssistenza" /> sul DTO <see cref="SintesiRichiesta" />.
        /// </summary>
        /// <param name="richiesta">La richiesta da mappare</param>
        /// <returns>Il DTO risultante dal mapping</returns>
        public SintesiRichiesta Map(RichiestaAssistenza richiesta)
        {
#warning Sarebbe conveniente usare la libreria AutoMapper per garantire la copertura completa
            return new SintesiRichiesta()
            {
                Id = richiesta.Id,
                Codice = richiesta.Codice,
                Rilevante = richiesta.Rilevante,
                IstanteRicezioneRichiesta = richiesta.IstanteRicezioneRichiesta,
                IstantePrimaAssegnazione = richiesta.IstantePrimaAssegnazione
            };
        }
    }
}
