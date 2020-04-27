//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesteAssistenzaQueryHandler.cs" company="CNVVF">
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
using AutoMapper;
using CQRS.Queries;
using Serilog;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza
{
    /// <summary>
    ///   Query per l'accesso alla lista delle richieste di assistenza "di interesse". Quali sono le
    ///   richieste interessanti è specificato dal DTO di input. Ecco alcuni esempi di ricerca, in
    ///   base ai valori contenuti nel DTO di input:
    ///   <para>
    ///     - DTO vuoto: vengono selezionate le prime 10 richieste aperte più recenti, appartenenti
    ///     all'unità operativa a cui fa capo l'utente autenticato;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una lista di unità operative: vengono selezionate le prime 10 richieste
    ///     aperte più recenti, appartenenti alle unità operative indicate dal DTO;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una stringa chiave: la ricerca restituisce le prime 10 richieste più
    ///     rilevanti rispetto al testo chiave (full-text search);
    ///   </para>
    ///   <para>
    ///     - DTO contenente un riferimento geo-referenziato: la ricerca restituisce le prime 10
    ///     richieste più vicine al riferimento;
    ///   </para>
    ///   <para>
    ///     - DTO contenente un array di stati richiesta: la ricerca restituisce le prime 10
    ///     richieste negli stati specificati.
    ///   </para>
    /// </summary>
    public class SintesiRichiesteAssistenzaQueryHandler : IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult>
    {
        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly ICercaRichiesteAssistenza _cercaRichiesteAssistenza;

        private readonly IGetListaSintesi _iGetListaSintesi;
        private readonly IMapper _mapper;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="cercaRichiesteAssistenza">L'istanza del servizio</param>
        /// <param name="iGetListaSintesi">
        ///   Interfaccia che restituisce l'elenco delle Sintesi delle Richieste
        /// </param>

        public SintesiRichiesteAssistenzaQueryHandler(ICercaRichiesteAssistenza cercaRichiesteAssistenza, IGetListaSintesi iGetListaSintesi,
            IMapper mapper, IGetUtenteById getUtenteById, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _cercaRichiesteAssistenza = cercaRichiesteAssistenza;
            _iGetListaSintesi = iGetListaSintesi;
            _mapper = mapper;
            _getUtenteById = getUtenteById;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public SintesiRichiesteAssistenzaResult Handle(SintesiRichiesteAssistenzaQuery query)
        {
            Log.Debug("Inizio elaborazione Lista Sintesi Richieste Assistenza Handler");

            var listaSediUtenteAbilitate = _getUtenteById.GetUtenteByCodice(query.Filtro.idOperatore).ListaUnitaOperativeAbilitate.ToHashSet();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();

            foreach (var sede in query.CodiciSede)
            {
                pinNodi.Add(new PinNodo(sede, true));
            }

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            query.Filtro.UnitaOperative = pinNodi.ToHashSet();

            var listaSintesi = _iGetListaSintesi.GetListaSintesiRichieste(query.Filtro);
            var listaSintesiPaginata = new List<SintesiRichiesta>();
            if (query.Filtro.Page > 0 && query.Filtro.PageSize > 0)
            {
                listaSintesiPaginata = listaSintesi.Skip((query.Filtro.Page - 1) * query.Filtro.PageSize).Take(query.Filtro.PageSize).ToList();
            }

            Log.Debug("Fine elaborazione Lista Sintesi Richieste Assistenza Handler");

            return new SintesiRichiesteAssistenzaResult()
            {
                SintesiRichiesta = (query.Filtro.Page > 0 && query.Filtro.PageSize > 0) ? listaSintesiPaginata : listaSintesi,
                Pagination = new Paginazione
                {
                    Page = query.Filtro.Page,
                    PageSize = query.Filtro.PageSize,
                    TotalItems = listaSintesi.Count
                }
            };
        }
    }
}
