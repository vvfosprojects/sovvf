//-----------------------------------------------------------------------
// <copyright file="GetSchedeContatto.cs" company="CNVVF">
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
using GeoCoordinatePortable;
using MongoDB.Driver;
using Newtonsoft.Json;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Geo;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue.Mock
{
    /// <summary>
    ///   Servizio che mocka tutti i servizi di lettura dal NUE (Scheda Contatto).
    /// </summary>
    public class GetSchedeMethods
    {
        private readonly string SchedeContattoJson = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.NueJson);
        private readonly string Competenza = "Competenza";
        private readonly string Conoscenza = "Conoscenza";
        private readonly string Deferibile = "Deferibile";
        private readonly DbContext _context;
        private readonly IGetSchedeContatto_WSNUE _getSchedeContatto_WSNUE;

        public GetSchedeMethods(DbContext context, IGetSchedeContatto_WSNUE getSchedeContatto_WSNUE)
        {
            _context = context;
            _getSchedeContatto_WSNUE = getSchedeContatto_WSNUE;
        }

        /// <summary>
        ///   Metodo che recupera tutti le schede contatto dal json SchedeContatto.
        /// </summary>
        public List<SchedaContatto> GetList(string codiceSede)
        {
            List<SchedaContatto> listaSchedeContatto = new List<SchedaContatto>();
            DateTime giornoMassimo = DateTime.Now.AddDays(-2);

            if (codiceSede.Length > 0)
                listaSchedeContatto = _context.SchedeContattoCollection.Find(s => s.CodiceSede.Equals(codiceSede) && !s.Collegata && s.DataInserimento >= giornoMassimo).ToList();
            else
                listaSchedeContatto = _context.SchedeContattoCollection.Find(s => !s.Collegata && s.DataInserimento >= giornoMassimo).ToList();

            return listaSchedeContatto;
        }

        /// <summary>
        ///   Metodo che restituisce la scheda contatto attuale
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <param name="codiceOperatore">il codice dell'operatore</param>
        /// <returns>SchedaContatto</returns>
        public SchedaContatto GetSchedaContattoAttuale(string codiceSede, string codiceOperatore)
        {
            var listaSchedeContatto = GetList(codiceSede);

            if (codiceOperatore == null) return listaSchedeContatto.Find(x =>
                 x.OperatoreChiamata.CodiceSede.Equals(codiceSede));

            return listaSchedeContatto.Find(x =>
                x.OperatoreChiamata.CodiceSede.Equals(codiceSede)
                && x.OperatoreChiamata.CodicePostazioneOperatore.Equals(codiceOperatore));
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto di quella sede
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchede(string codiceSede)
        {
            return GetList(codiceSede);
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto lavorate dagli operatori identificati
        ///   dal loro codici fiscali
        /// </summary>
        /// <param name="codiciFiscali">il codice sede</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoFromCodiciFiscali(List<string> codiciFiscali)
        {
            var listaSchedeContatto = GetList("");
            var listaSchedeContattoFiltered = new List<SchedaContatto>();

            foreach (var codice in codiciFiscali)
            {
                foreach (var scheda in listaSchedeContatto)
                {
                    if (scheda.OperatoreChiamata.CodiceFiscale.Equals(codice)) listaSchedeContattoFiltered.Add(scheda);
                }
            }

            return listaSchedeContattoFiltered;
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto lavorate in un dato lasso di tempo
        /// </summary>
        /// <param name="dataDa">la data di partenza</param>
        /// <param name="dataA">la data di fine</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoTimeSpan(DateTime dataDa, DateTime dataA, string codiceSede)
        {
            return GetList(codiceSede).FindAll(x => x.DataInserimento >= dataDa && x.DataInserimento <= dataA);
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto che hanno lo stato a gestita
        /// </summary>
        /// <param name="gestita">booleana getsita</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoGestita(bool gestita, string codiceSede)
        {
            return GetList(codiceSede).FindAll(x => x.Gestita.Equals(gestita));
        }

        /// <summary>
        ///   Metodo che restituisce le schede contatto di quella classificazione
        /// </summary>
        /// <param name="classificazione">una lista di stringhe</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoFromListTipo(List<string> classificazione, string codiceSede)
        {
            var listaSchedeContatto = GetList(codiceSede);
            var listaSchedeContattoFiltered = new List<SchedaContatto>();

            foreach (var classe in classificazione)
            {
                foreach (var scheda in listaSchedeContatto)
                {
                    if (scheda.Classificazione.Equals(classe)) listaSchedeContattoFiltered.Add(scheda);
                }
            }

            return listaSchedeContattoFiltered;
        }

        /// <summary>
        ///   Metodo che restituisce le schede contatto che contengono il testo in firma (ricerca a
        ///   testo libero)
        /// </summary>
        /// <param name="testolibero">una stringa</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoFromText(string testolibero, string codiceSede)
        {
            var listaSchede = GetList(codiceSede);

            return (from schedaContatto in listaSchede let schedacontattoJson = JsonConvert.SerializeObject(schedaContatto) where schedacontattoJson.Contains(testolibero, StringComparison.CurrentCultureIgnoreCase) select schedaContatto).ToList();
        }

        /// <summary>
        ///   Metodo che restituisce le schede contatto lavorate in un area definita da un set di
        ///   coordinate in firma
        /// </summary>
        /// <param name="lat1">double latitudine topright</param>
        /// <param name="lon1">double longitudine topright</param>
        /// <param name="lat2">double latitudine bottomleft</param>
        /// <param name="lon2">double longitudine bottomleft</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoBySpatialArea(double lat1, double lon1, double lat2, double lon2)
        {
            var topRight = new GeoCoordinate(lat1, lon1);
            var bottomLeft = new GeoCoordinate(lat2, lon2);
            var listaSchede = GetList("");
            var listaSchedeFiltered = new List<SchedaContatto>();

            listaSchedeFiltered.AddRange(listaSchede.Where(x => x.Localita.Coordinate.Latitudine >= bottomLeft.Latitude && x.Localita.Coordinate.Latitudine <= topRight.Latitude && x.Localita.Coordinate.Longitudine >= bottomLeft.Longitude && x.Localita.Coordinate.Longitudine <= topRight.Longitude));

            return listaSchedeFiltered;
        }

        /// <summary>
        ///   Metodo che restituisce le schede contatto lavorate in un area definita da un set di
        ///   coordinate in firma
        /// </summary>
        /// <param name="testolibero">la stringa per la ricerca a testo libero</param>
        /// <param name="gestita">booleana gestita</param>
        /// <param name="letta">booleana letta</param>
        /// <param name="codiceFiscale">codice fiscale operatore</param>
        /// <param name="rangeOre">range di ore</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetFiltered(string testolibero, bool? gestita, string codiceFiscale, double? rangeOre, string classificazione, string codiceSede)
        {
            var listaSchedeContatto = new List<SchedaContatto>();
            var giornoMassimo = DateTime.UtcNow.AddHours(-(double)(rangeOre ?? 48.0));

            if (codiceSede.Length > 0)
                listaSchedeContatto = _context.SchedeContattoCollection.Find(s => s.CodiceSede.Equals(codiceSede) && !s.Collegata && s.DataInserimento >= giornoMassimo).ToList();
            else
                listaSchedeContatto = _context.SchedeContattoCollection.Find(s => !s.Collegata && s.DataInserimento >= giornoMassimo).ToList();

            var listaSchedeFiltrate = listaSchedeContatto;

            if (!string.IsNullOrWhiteSpace(testolibero))
                listaSchedeFiltrate = GetSchedeContattoFromText(testolibero, codiceSede);

            if (!string.IsNullOrWhiteSpace(codiceFiscale))
                listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.OperatoreChiamata.CodiceFiscale.Equals(codiceFiscale));

            if (gestita == null)
                gestita = false;

            listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.Gestita.Equals(gestita));

            if (rangeOre.HasValue)
            {
                var dataCorrente = DateTime.UtcNow.AddHours(-(double)rangeOre);
                listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.DataInserimento >= dataCorrente);
            }

            if (!classificazione.Equals("Tutte"))
            {
                listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.Classificazione.Equals(classificazione));
            }

            return listaSchedeFiltrate;
        }

        /// <summary>
        ///   Metodo che restituisce le schede contatto Marker
        /// </summary>
        /// <param name="area">l'area mappa con i filtri</param>
        /// <returns>una lista di schede marker</returns>
        public List<SchedaContattoMarker> GetMarkerFiltered(AreaMappa area)
        {
            var listaSchedeMarker = new List<SchedaContattoMarker>();
            if (area.TopRight != null)
            {
                var listaSchedeContatto = GetSchedeContattoBySpatialArea(area.TopRight.Latitudine, area.TopRight.Longitudine, area.BottomLeft.Latitudine, area.BottomLeft.Longitudine);

                foreach (var scheda in listaSchedeContatto)
                {
                    var schedaMarker = new SchedaContattoMarker
                    {
                        CodiceOperatore = scheda.OperatoreChiamata.CodicePostazioneOperatore,
                        CodiceScheda = scheda.CodiceScheda,
                        Localita = scheda.Localita,
                        Priorita = scheda.Priorita,
                        Classificazione = scheda.Classificazione,
                        Gestita = scheda.Gestita
                    };
                    listaSchedeMarker.Add(schedaMarker);
                }
                if (area.FiltroSchedeContatto?.MostraGestite == true)
                {
                    return listaSchedeMarker;
                }
                else
                {
                    return listaSchedeMarker.FindAll(x => !x.Gestita);
                }
            }
            else return listaSchedeMarker;
        }

        /// <summary>
        ///   Metodo che restituisce il conteggio delle schede contatto in base alla loro classificazione.
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// ///
        /// <returns>InfoNue</returns>
        public InfoNue GetConteggio(string[] codiciSede, FiltriContatoriSchedeContatto Filtri)
        {
            var listaSchede = new List<SchedaContatto>();

            List<SchedaContatto> listaSchedeContatto = new List<SchedaContatto>();

            var GiorniFiltrati = Filtri.RangeVisualizzazione != null ? Convert.ToInt32(Filtri.RangeVisualizzazione) : 2;
            DateTime giornoMassimo = DateTime.Now.AddHours(-GiorniFiltrati);

            if (codiciSede.Length > 0)
                listaSchedeContatto = _context.SchedeContattoCollection.Find(s => s.CodiceSede.Equals(codiciSede[0]) && !s.Collegata && s.DataInserimento >= giornoMassimo && s.Gestita.Equals(Filtri.Gestita)).ToList();
            else
                listaSchedeContatto = _context.SchedeContattoCollection.Find(s => !s.Collegata && s.DataInserimento >= giornoMassimo && s.Gestita.Equals(Filtri.Gestita)).ToList();

            if (Filtri.Search.Trim().Length > 0)
                listaSchedeContatto = GetSchedeContattoFromText(Filtri.Search, codiciSede[0]);

            var listaSchedeCompetenza = listaSchedeContatto.FindAll(x => x.Classificazione.Equals(Competenza));
            var listaSchedeConoscenza = listaSchedeContatto.FindAll(x => x.Classificazione.Equals(Conoscenza));
            var listaSchedeDifferibile = listaSchedeContatto.FindAll(x => x.Classificazione.Equals(Deferibile));

            return new InfoNue
            {
                TotaleSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchedeContatto.Count,
                    ContatoreFiltroAttivo = listaSchedeContatto.FindAll(x => x.Gestita.Equals(Filtri.Gestita)).Count
                },
                CompetenzaSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchedeCompetenza.Count,
                    ContatoreFiltroAttivo = listaSchedeCompetenza.FindAll(x => x.Gestita.Equals(Filtri.Gestita)).Count
                },
                ConoscenzaSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchedeConoscenza.Count,
                    ContatoreFiltroAttivo = listaSchedeConoscenza.FindAll(x => x.Gestita.Equals(Filtri.Gestita)).Count
                },
                DifferibileSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchedeDifferibile.Count,
                    ContatoreFiltroAttivo = listaSchedeDifferibile.FindAll(x => x.Gestita.Equals(Filtri.Gestita)).Count,
                }
            };
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto indicate nell'array di codici schede
        ///   in input
        /// </summary>
        /// <param name="codiciScheda">Array di codici scheda</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoByCodiciScheda(List<string> codiciScheda, string codiceSede)
        {
            return GetList(codiceSede).FindAll(x => codiciScheda.Any(cod => cod.Equals(x.CodiceScheda)));
        }
    }
}
