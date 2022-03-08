//-----------------------------------------------------------------------
// <copyright file="ListaOperatoriQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori
{
    /// <summary>
    ///   Il query handler che cerca la lista degli operatori
    /// </summary>
    public class ListaOperatoriQueryHandler : IQueryHandler<ListaOperatoriQuery, ListaOperatoriResult>
    {
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetUtentiByCodiciSedi _getUtenteByCodiciSedi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetSedi _getSedi;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="getUtenteById">
        ///   interfaccia per il reperimento degli utenti a partire dall'id
        /// </param>
        /// <param name="getAlberaturaUnitaOperative">
        ///   interfaccia per il reperimento delle uo alberate
        /// </param>
        /// <param name="getUtenteByCodiciSedi">
        ///   interfaccia per la lista degli utenti a partire da una lista di codici sede
        /// </param>
        public ListaOperatoriQueryHandler(IGetSedi getSedi, IGetUtenteById getUtenteById, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, IGetUtentiByCodiciSedi getUtenteByCodiciSedi)
        {
            _getUtenteById = getUtenteById;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getUtenteByCodiciSedi = getUtenteByCodiciSedi;
            _getSedi = getSedi;
        }

        /// <summary>
        ///   metodo che utilizza la query in firma per effettuare la ricerca degli operatori a
        ///   seconda dei parametri immessi nella query stessa
        /// </summary>
        /// <param name="query">la query in firma</param>
        /// <returns>ListaOperatoriResult</returns>
        public ListaOperatoriResult Handle(ListaOperatoriQuery query)
        {
            var utente = _getUtenteById.GetUtenteByCodice(query.IdUtente);
            var listaCodiciSedeRuoloAdmin = new List<string>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var lstSediAll = _getSedi.GetAll();
            var listaPin = new List<PinNodo>();

            foreach (var ruolo in utente.Ruoli.FindAll(x => x.Descrizione.Equals("Amministratore")))
            {
                listaCodiciSedeRuoloAdmin.Add(ruolo.CodSede);
                if (ruolo.Ricorsivo)
                {
                    listaPin.Add(new PinNodo(ruolo.CodSede, ruolo.Ricorsivo));
                    foreach (var figli in sediAlberate.Result.GetSottoAlbero(listaPin))
                    {
                        listaCodiciSedeRuoloAdmin.Add(figli.Codice);
                    }
                }
            }

            var utentiByCodSede = _getUtenteByCodiciSedi.Get(listaCodiciSedeRuoloAdmin, query.Filters.Search);
            if (query.Filters.CodSede != null)
            {
                var listaFiltrata = new List<Utente>();
                foreach (string sede in query.Filters.CodSede)
                {
                    listaFiltrata.AddRange(utentiByCodSede.FindAll(x => x.Ruoli.Any(y => y.CodSede.Equals(sede))).ToList());
                }

                utentiByCodSede = listaFiltrata.ToHashSet().ToList();
            }

            utentiByCodSede.Reverse();
            var utentiPaginati = utentiByCodSede.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
            query.Pagination.TotalItems = utentiByCodSede.Count;

            var listaSediPresenti = new List<Role>();

            var filtriSedi = query.Utente.Ruoli.Select(r => r.CodSede).Distinct().OrderByDescending(s => s == "CON");

            foreach (var filtroSede in filtriSedi)
            {
                if (filtroSede.Contains(".1000")) //comando
                {
                    var lst = lstSediAll.Result
                        .Where(p => p.Codice.Contains($"{filtroSede.Split('.')[0]}.") && !listaSediPresenti.Any(sede => sede.CodSede.Equals(p.Codice)))
                        .Where(p => p.Codice.Contains('.'))
                        .Select(p => new Role("", p.Codice) { DescSede = lstSediAll.Result.Find(s => s.Codice.Equals(p.Codice)).Descrizione });

                    listaSediPresenti.AddRange(lst);
                }
                else if (filtroSede.Contains('.'))
                {
                    if(!listaSediPresenti.Any(sede => sede.CodSede.Equals(filtroSede)))
                        listaSediPresenti.Add(new Role("", filtroSede) { DescSede = lstSediAll.Result.FirstOrDefault(s => s.Codice.Equals(filtroSede))?.Descrizione });
                }
                else if (filtroSede.Equals("CON"))
                {
                    var lst = lstSediAll.Result.Select(p => new Role("", p.Codice) { DescSede = p.Descrizione });

                    listaSediPresenti = lst.ToList();

                    break;
                }
            }

            return new ListaOperatoriResult
            {
                DataArray = utentiPaginati,
                Pagination = query.Pagination,
                ListaSediPresenti = listaSediPresenti
            };
        }
    }
}
