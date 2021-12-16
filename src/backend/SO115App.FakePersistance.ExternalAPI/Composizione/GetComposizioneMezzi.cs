﻿using GeoCoordinatePortable;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        //private readonly OrdinamentoMezzi _ordinamento;

        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoMezzi _getMezziPrenotati;

        private readonly IGetSedi _getSedi;

        private readonly IGetPosizioneByCodiceMezzo _geofleet;

        public GetComposizioneMezzi(IGetPosizioneByCodiceMezzo geofleet, IGetSedi getSedi, IGetStatoMezzi getMezziPrenotati, IGetStatoSquadra getStatoSquadre, IGetSquadre getSquadre, IGetMezziUtilizzabili getMezziUtilizzabili, IGetTipologieByCodice getTipologieCodice, IConfiguration config, IHttpRequestManager<Google_API.DistanceMatrix> clientMatrix)
        {
            _getSedi = getSedi;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _geofleet = geofleet;
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var lstSedi = _getSedi.GetAll();

            //GESTIONE CODICI SEDI
            if (query.CodiciSedi.Contains("00") || query.CodiciSedi.Contains("001"))
                query.CodiciSedi = lstSedi.Result.Select(s => s.Codice).ToArray();

            var lstSquadreWS = query.CodiciSedi.Select(sede => _getSquadre.GetAllByCodiceDistaccamento(sede.Split('.')[0]).Result).ToList();

            List<Models.Classi.ServiziEsterni.OPService.Squadra> lstSquadre = new List<SO115App.Models.Classi.ServiziEsterni.OPService.Squadra>();
            if (lstSquadreWS[0] != null)
                lstSquadre = lstSquadreWS.SelectMany(shift => shift?.Squadre).ToList();

            var lstStatiSquadre = _getStatoSquadre.Get("", query.CodiciSedi.ToList());
            var lstSquadrePreaccoppiate = lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null).ToList();

            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiciSedi);

            var lstMezziComposizione = _getMezziUtilizzabili.GetBySedi(query.CodiciSedi.Distinct().ToArray()) //OTTENGO I DATI
            .ContinueWith(mezzi => //MAPPING
            {
                var lstMezzi = new ConcurrentBag<ComposizioneMezzi>();

                Parallel.ForEach(mezzi.Result, m =>
                {
                    var lstSqPreacc = Task.Run(() => lstSquadrePreaccoppiate?.Where(sq => sq.CodiciMezziPreaccoppiati?.Contains(m.Codice) ?? false)?.Select(sq => new SquadraSemplice()
                    {
                        Codice = sq.Codice,
                        Nome = sq.Descrizione,
                        Distaccamento = new Sede(sq.Distaccamento),
                        Turno = sq.TurnoAttuale.ToCharArray()[0]
                    }).ToList());

                    var lstSquadreInRientro = Task.Run(() => lstStatiSquadre.Where(s => s.StatoSquadra == Costanti.MezzoInRientro && s.CodMezzo == m.Codice).Select(s => new SquadraSemplice()
                    {
                        Codice = s.IdSquadra,
                        Distaccamento = new Sede(lstSedi.Result.FirstOrDefault(sede => sede?.Codice == s.CodiceSede)?.Descrizione),
                        Nome = s.IdSquadra,
                        Stato = MappaStatoSquadraDaStatoMezzo.MappaStatoComposizione(s.StatoSquadra),
                        Membri = lstSquadre.FirstOrDefault(sq => sq.Codice.Equals(s.IdSquadra))?.Membri.Select(m => new Componente()
                        {
                            CodiceFiscale = m.CodiceFiscale,
                            DescrizioneQualifica = m.Ruolo,
                            Nominativo = $"{m.FirstName} {m.LastName}",
                            Ruolo = m.Ruolo
                        }).ToList(),
                        Turno = lstSquadre.FirstOrDefault(sq => sq.Codice.Equals(s.IdSquadra))?.TurnoAttuale.ToCharArray()[0] ?? 'X',
                    }).ToList());

                    m.PreAccoppiato = lstSqPreacc.Result?.Count > 0;
                    m.IdRichiesta = statiOperativiMezzi.FirstOrDefault(s => s.CodiceMezzo == m.Codice)?.CodiceRichiesta;

                    var coord = query.Richiesta.Localita.CoordinateString.Select(c => c.Replace(',', '.')).ToArray();

                    Coordinate coordinateMezzo = null;

                    if (m.CoordinateStrg != null)
                    {
                        if (m.CoordinateStrg[0] == null)
                        {
                            coordinateMezzo = new Coordinate(m.Distaccamento.Coordinate.Latitudine, m.Distaccamento.Coordinate.Longitudine);
                        }
                        else
                            coordinateMezzo = new Coordinate(Convert.ToDouble(m.CoordinateStrg[0]), Convert.ToDouble(m.CoordinateStrg[1]));
                    }
                    var distanzaKm = "";
                    if (coordinateMezzo != null)
                    {
#if !DEBUG
                        distanzaKm = (new GeoCoordinate(coordinateMezzo.Latitudine, coordinateMezzo.Longitudine)
                            .GetDistanceTo(new GeoCoordinate(Convert.ToDouble(coord[0]), Convert.ToDouble(coord[1])))
                            / 1000).ToString("N1");
#endif
#if DEBUG
                        distanzaKm = "0";
#endif
                    }

                    var mc = new ComposizioneMezzi()
                    {
                        //Id = m.Codice,
                        Mezzo = m,
                        IndirizzoIntervento = m.Stato != Costanti.MezzoInSede ? query?.Richiesta?.Localita.Indirizzo : null,
                        SquadrePreaccoppiate = lstSqPreacc.Result,
                        ListaSquadre = lstSquadreInRientro.Result,
                        Km = distanzaKm,
                        TempoPercorrenza = null
                    };

                    var statoMezzo = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice));

                    if (statoMezzo != null)
                    {
                        mc.Mezzo.Stato = statoMezzo.StatoOperativo;

                        switch (mc.Mezzo.Stato)
                        {
                            case Costanti.MezzoInViaggio:
                                mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                                mc.Km = distanzaKm;
                                break;

                            case Costanti.MezzoSulPosto:
                                mc.IndirizzoIntervento = query.Richiesta.Localita.Indirizzo;
                                mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                                mc.Km = "0";
                                break;

                            case Costanti.MezzoInRientro:
                                goto case Costanti.MezzoInViaggio;
                        }
                    }

                    lstMezzi.Add(mc);
                });

                return lstMezzi;
            }).ContinueWith(lstmezzi => lstmezzi.Result?.Where(mezzo => //FILTRAGGIO
            {
                bool ricerca = string.IsNullOrEmpty(query.Filtro?.Ricerca?.ToUpper()) ||
                    mezzo.Mezzo.Codice.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) ||
                    mezzo.Mezzo.Descrizione.ToUpper().Contains(query.Filtro.Ricerca.ToUpper());

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato) ?
                    query.Filtro.CodiciDistaccamenti?.Contains(mezzo.Mezzo.Distaccamento?.Codice) ?? true :
                    query.Filtro.CodDistaccamentoSelezionato?.Equals(mezzo.Mezzo.Distaccamento?.Codice) ?? true;

                bool genere = (query.Filtro.Autista == true || query.Filtro.Autista == null) ? query.Filtro?.Tipo?.Contains(mezzo.Mezzo.Genere) ?? true : mezzo.Mezzo.Genere.ToLower().Contains("av");

                bool stato = query.Filtro?.Stato?.Contains(mezzo.Mezzo.Stato) ?? true;

                return ricerca && distaccamento && genere && stato;
            })).ContinueWith(lstMezzi =>//ORDINAMENTO
            {
                return lstMezzi.Result
                .OrderBy(mezzo => (!query?.Filtro?.CodMezzoSelezionato?.Equals(mezzo.Mezzo.Codice)) ?? false)
                .OrderBy(mezzo => (!query?.Filtro?.CodDistaccamentoSelezionato?.Equals(mezzo.Mezzo.Codice)) ?? false)
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoSulPosto))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoOccupato))
                .ThenByDescending(mezzo => query.Richiesta.Competenze[0]?.Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) ?? false)
                .ThenByDescending(mezzo => query.Richiesta.Competenze.Count > 1 ? query.Richiesta.Competenze[1].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                .ThenByDescending(mezzo => query.Richiesta.Competenze.Count > 2 ? query.Richiesta.Competenze[2].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                .ThenBy(mezzo => mezzo.Mezzo.Distaccamento?.Codice)
                .ToList();
            });

            var result = lstMezziComposizione.Result.ToList();

            return result;
        }
    }
}
