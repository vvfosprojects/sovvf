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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;

namespace SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi
{
    /// <summary>
    ///   Implementazione del servizio di mapping di <see cref="RichiestaAssistenza" /> sul DTO <see cref="SintesiRichiesta" />.
    /// </summary>
    internal class MapperRichiestaSuSintesi : IMapperRichiestaSuSintesi
    {
        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly IGetUnitaOperativaPerCodice getUnitaOperativaPerCodice;

        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly MapperMezzoSuSintesi mapperMezzoSuSintesi;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="getUnitaOperativaPerCodice">
        ///   L'istanza del servizio di risoluzione unità operativa a partire dal codice
        /// </param>
        /// <param name="mapperMezzoSuSintesi">
        ///   L'istanza del servizio di mapping di un mezzo sulla sintesi
        /// </param>
        public MapperRichiestaSuSintesi(
            IGetUnitaOperativaPerCodice getUnitaOperativaPerCodice,
            MapperMezzoSuSintesi mapperMezzoSuSintesi)
        {
            this.getUnitaOperativaPerCodice = getUnitaOperativaPerCodice;
            this.mapperMezzoSuSintesi = mapperMezzoSuSintesi;
        }

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
                IstanteRicezioneRichiesta = richiesta.IstanteRicezioneRichiesta.Value,
                IstantePrimaAssegnazione = richiesta.IstantePrimaAssegnazione,
                Tipologie = richiesta.Tipologie,
                Descrizione = richiesta.Descrizione,
                Richiedente = richiesta.Richiedente,
                Localita = richiesta.Localita,
                Competenze = richiesta.Competenze,
                ZoneEmergenza = richiesta.ZoneEmergenza,
                IstantePresaInCarico = richiesta.IstantePresaInCarico,
                CodiceSchedaNue = richiesta.CodiceSchedaNue,
            };
        }
    }
}
