//-----------------------------------------------------------------------
// <copyright file="ComposizioneSquadreQueryHandler.cs" company="CNVVF">
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
using Serilog;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    public class ComposizionePartenzaAvanzataQueryHandler : IQueryHandler<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        //private readonly IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> _composizioneMezzihandler;
        //private readonly IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> _composizioneSquadrehandler;

        //public ComposizionePartenzaAvanzataQueryHandler(
        //    IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> composizioneMezzihandler,
        //    IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> composizioneSquadrehandler
        //    )
        //{
        //    _composizioneMezzihandler = composizioneMezzihandler;
        //    _composizioneSquadrehandler = composizioneSquadrehandler;
        //}

        private readonly IGetListaSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        private readonly IGetStatoMezzi _getMezziPrenotati;
        //private readonly OrdinamentoMezzi _ordinamentoMezzi;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;

        public ComposizionePartenzaAvanzataQueryHandler(IGetListaSquadre getSquadre, IGetStatoSquadra getStatoSquadre, IGetStatoMezzi getMezziPrenotati, IGetMezziUtilizzabili getMezziUtilizzabili)
        {
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
        }

        public ComposizionePartenzaAvanzataResult Handle(ComposizionePartenzaAvanzataQuery query)
        {
            Log.Debug("Inizio elaborazione Composizione partenza avanzata Handler");

            var lstSedi = new List<string>() { query.CodiceSede };

            var lstMezzi = _getMezziUtilizzabili.Get(lstSedi).Result;
            var lstSquadre = _getSquadre.Get(lstSedi).Result;
            var statiOperativi = _getStatoSquadre.Get(lstSedi);

            #region MEZZI 

            var composizioneMezzi = GeneraListaComposizioneMezzi(lstMezzi);
            string[] generiMezzi;
            string[] statiMezzi;
            string codiceDistaccamento;

            foreach (var composizione in composizioneMezzi)
            {
                //composizione.IndiceOrdinamento = _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.CoordinateFake, composizione.Mezzo.IdRichiesta);
                composizione.Id = composizione.Mezzo.Codice;

                if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                {
                    composizione.IstanteScadenzaSelezione = null;
                }
            }

            var composizioneMezziPrenotati = GetComposizioneMezziPrenotati(composizioneMezzi, query.CodiceSede);
            //Per i mezzi con coordinate Fake nella property  i Km  e la TempoPercorrenza vengono impostati i  valori medi della collection
            decimal totaleKM = 0;
            decimal totaleTempoPercorrenza = 0;

            foreach (var composizione in composizioneMezziPrenotati)
            {
                totaleKM = totaleKM + Convert.ToDecimal(composizione.Km.Replace(".", ","));
                totaleTempoPercorrenza = totaleTempoPercorrenza + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ","));
            }

            string mediaDistanza = Math.Round((totaleKM / composizioneMezzi.Count), 2).ToString(CultureInfo.InvariantCulture);
            string mediaTempoPercorrenza = Math.Round((totaleTempoPercorrenza / composizioneMezzi.Count), 2).ToString(CultureInfo.InvariantCulture);

            foreach (var composizione in composizioneMezziPrenotati)
            {
                if (composizione.Mezzo.CoordinateFake)
                {
                    composizione.Km = mediaDistanza;
                    composizione.TempoPercorrenza = mediaTempoPercorrenza;
                    //composizione.IndiceOrdinamento = _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.CoordinateFake, composizione.Mezzo.IdRichiesta);
                    composizione.Km = null;
                    composizione.TempoPercorrenza = null;
                }
            }

            var mezziresult = composizioneMezziPrenotati.OrderByDescending(x => x.IndiceOrdinamento).ToList();

            #endregion

            #region SQUADRE

            var composizioneSquadre = new List<Classi.Composizione.ComposizioneSquadre>();

            foreach (Squadra s in lstSquadre)
            {
                if (statiOperativi.Exists(x => x.IdSquadra.Equals(s.Id)))
                {
                    s.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(statiOperativi.Find(x => x.IdSquadra.Equals(s.Id)).StatoSquadra);
                    s.IndiceOrdinamento = -200;
                }
                else
                {
                    s.Stato = Squadra.StatoSquadra.InSede;
                }

                var c = new Classi.Composizione.ComposizioneSquadre
                {
                    Squadra = s,
                    Id = s.Id
                };
                composizioneSquadre.Add(c);
            }

            var squadreresult = composizioneSquadre.OrderByDescending(x => x.Squadra.IndiceOrdinamento).ToList();

            #endregion



            var composizioneAvanzata = new Classi.Composizione.ComposizionePartenzaAvanzata()
            {
                ComposizioneMezziDataArray = mezziresult,
                ComposizioneSquadreDataArray = squadreresult,
                MezziPagination = query.Filtro.MezziPagination,
                SquadrePagination = query.Filtro.SquadrePagination
            };

            Log.Debug("Fine elaborazione Composizione partenza avanzata Handler");

            return new ComposizionePartenzaAvanzataResult()
            {
                ComposizionePartenzaAvanzata = composizioneAvanzata
            };
        }

        private List<Classi.Composizione.ComposizioneMezzi> GetComposizioneMezziPrenotati(List<Classi.Composizione.ComposizioneMezzi> composizioneMezzi, string codiceSede)
        {
            var mezziPrenotati = _getMezziPrenotati.Get(codiceSede);
            foreach (var composizione in composizioneMezzi)
            {
                if (mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)) != null)
                {
                    composizione.IstanteScadenzaSelezione = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)).IstanteScadenzaSelezione;

                    if (composizione.Mezzo.Stato.Equals("In Sede"))
                    {
                        composizione.Mezzo.Stato = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)).StatoOperativo;
                    }
                }
            }
            return composizioneMezzi;
        }

        private List<Classi.Composizione.ComposizioneMezzi> GeneraListaComposizioneMezzi(IEnumerable<Mezzo> listaMezzi)
        {
            var random = new Random();

            return (from mezzo in listaMezzi
                    let kmGen = random.Next(1, 60).ToString()
                    let tempoPer = Convert.ToDouble(kmGen.Replace(".", ",")) / 1.75
                    select new Classi.Composizione.ComposizioneMezzi()
                    {
                        Id = mezzo.Codice,
                        Mezzo = mezzo,
                        Km = kmGen,
                        TempoPercorrenza = Math.Round(tempoPer, 2).ToString(CultureInfo.InvariantCulture),
                    }).ToList();
        }
    }
}
