﻿//-----------------------------------------------------------------------
// <copyright file="GetComposizioneMezzi.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.InfoRichiesta;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    /// <summary>
    ///   La classe recupera i dati di tutti i mezzi utilizzabili dal gac e i dati delle richieste
    ///   associate ai mezzi e restistuisce una lista di mezzi in servizio completa di tutte le
    ///   informazioni (squadre sul mezzo, richiesta a cui il mezzo e associato e il mezzo stesso)
    /// </summary>
    public class GetMezziInServizio : IGetMezziInServizio
    {
        private readonly IGetInfoRichiesta _getInfoRichiesta;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetStatoMezzi _getStatoMezzi;

        public GetMezziInServizio(IGetInfoRichiesta getInfoRichiesta, IGetMezziUtilizzabili getMezziUtilizzabili, IGetRichiesta getRichiestaById, IGetStatoMezzi getStatoMezzi)
        {
            _getInfoRichiesta = getInfoRichiesta;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getRichiestaById = getRichiestaById;
            _getStatoMezzi = getStatoMezzi;
        }

        /// <summary>
        ///   il metodo restituisce una lista di mezzi in servizio associati ad una determinata sede
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <returns>Lista di MezziInServizio</returns>
        public List<MezzoInServizio> Get(string[] CodiciSede)
        {
            var mezzi = _getMezziUtilizzabili.Get(CodiciSede.ToList()).Result;

            if ((!mezzi?.Any()) ?? true)
                return new List<MezzoInServizio>();

            var statoMezzi = _getStatoMezzi.Get(CodiciSede);

            var listaMezzoInServizio = new ConcurrentBag<MezzoInServizio>();

            //Parallel.ForEach(mezzi, mezzo =>
            foreach (var mezzo in mezzi)
            {
                var statoOperativoMezzi = statoMezzi.Find(x => x.CodiceMezzo.Equals(mezzo.Codice));
                mezzo.Stato = statoOperativoMezzi != null ? statoOperativoMezzi.StatoOperativo : Costanti.MezzoInSede;
                mezzo.IdRichiesta = statoOperativoMezzi?.CodiceRichiesta;
                var mezzoMarker = new MezzoMarker()
                {
                    Mezzo = mezzo,
                    InfoRichiesta = _getInfoRichiesta.GetInfoRichiestaFromCodiceRichiestaMezzo(mezzo.IdRichiesta)
                };
                var mezzoInServizio = new MezzoInServizio()
                {
                    Mezzo = mezzoMarker
                };

                if (mezzo.IdRichiesta != null)
                {
                    var richiesta = _getRichiestaById.GetByCodice(mezzo.IdRichiesta);
                    if (richiesta != null)
                    {
                        foreach (var partenza in richiesta.Partenze)
                        {
                            if (partenza.Partenza.Mezzo.Codice == mezzo.Codice)
                            {
                                mezzoInServizio.Squadre = partenza.Partenza.Squadre;
                            }
                        }
                    }
                }
                else
                {
                    mezzoInServizio.Squadre = null;
                }

                listaMezzoInServizio.Add(mezzoInServizio);
            };

            var listaFiltrata = listaMezzoInServizio.Where(x => x != null);

            return listaFiltrata
                .OrderBy(c => c.Mezzo.Mezzo.Stato == Costanti.MezzoInSede).ToList();
        }


        public List<MezzoInServizio> MapPartenzeInMezziInServizio(RichiestaAssistenza richiestaAssistenza, string[] CodiciSede)
        {
            var listaMezzoInServizio = new ConcurrentBag<MezzoInServizio>();

            var Partenze = richiestaAssistenza.Partenze;
            var statoMezzi = _getStatoMezzi.Get(CodiciSede);


            foreach (var partenza in Partenze)
            {
                var mezzo = partenza.Partenza.Mezzo;
                var statoOperativoMezzi = statoMezzi.Find(x => x.CodiceMezzo.Equals(mezzo.Codice));
                mezzo.Stato = statoOperativoMezzi != null ? statoOperativoMezzi.StatoOperativo : Costanti.MezzoInSede;
                mezzo.IdRichiesta = statoOperativoMezzi?.CodiceRichiesta;
                var mezzoMarker = new MezzoMarker()
                {
                    Mezzo = mezzo,
                    InfoRichiesta = new InfoRichiesta()
                    {
                        CodiceRichiesta = richiestaAssistenza.CodRichiesta,
                        Indirizzo = richiestaAssistenza.Localita.Indirizzo,
                        SchedaContatto = richiestaAssistenza.CodNue
                    }
                };
                var mezzoInServizio = new MezzoInServizio()
                {
                    Mezzo = mezzoMarker,
                    Squadre = partenza.Partenza.Squadre,                    
                };

                listaMezzoInServizio.Add(mezzoInServizio);
            }


            var listaFiltrata = listaMezzoInServizio.Where(x => x != null);

            return listaFiltrata
                .OrderBy(c => c.Mezzo.Mezzo.Stato == Costanti.MezzoInSede).ToList();
        }
    }
}
