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
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;

namespace SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi
{
    /// <summary>
    ///   Servizio di mapping di un mezzo sul DTO della sintesi richiesta di assistenza
    /// </summary>
    internal class MapperMezzoSuSintesi
    {
        /// <summary>
        ///   L'istanza del servizio
        /// </summary>
        private readonly IGetMezzoByCodice getMezzoByCodice;

        /// <summary>
        ///   Il costruttore
        /// </summary>
        /// <param name="getMezzoByCodice">L'istanza del servizio di risoluzione anagrafica mezzo</param>
        public MapperMezzoSuSintesi(IGetMezzoByCodice getMezzoByCodice)
        {
            this.getMezzoByCodice = getMezzoByCodice;
        }

        /// <summary>
        ///   Metodo di mapping sul DTO sintesi richiesta
        /// </summary>
        /// <param name="codice">Il codice del mezzo</param>
        /// <param name="stato">Lo stato corrente del mezzo</param>
        /// <returns>Il DTO del mezzo</returns>
        public Mezzo Map(string codice, IStatoMezzo stato)
        {
            var mezzo = this.getMezzoByCodice.Get(codice);
            return new Mezzo()
            {
                Codice = codice,
                StatoMezzo = stato.Codice,
                DescrizioneStato = stato.Descrizione,
                Descrizione = mezzo.Descrizione,
                Genere = mezzo.Genere
            };
        }
    }
}
