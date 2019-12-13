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
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

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
        private readonly string Differibile = "Differibile";

        /// <summary>
        ///   Metodo che recupera tutti le schede contatto dal json SchedeContatto.
        /// </summary>
        public List<SchedaContatto> GetList()
        {
            string json;

            using (var r = new StreamReader(SchedeContattoJson))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<SchedaContatto>>(json);
        }

        /// <summary>
        ///   Metodo che restituisce la scheda contatto attuale
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <param name="codiceOperatore">il codice dell'operatore</param>
        /// <returns>SchedaContatto</returns>
        public SchedaContatto GetSchedaContattoAttuale(string codiceSede, string codiceOperatore)
        {
            var listaSchedeContatto = GetList();

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
            return GetList().FindAll(x => x.OperatoreChiamata.CodiceSede.Equals(codiceSede));
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto lavorate dagli operatori identificati
        ///   dal loro codici fiscali
        /// </summary>
        /// <param name="codiciFiscali">il codice sede</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoFromCodiciFiscali(List<string> codiciFiscali)
        {
            var listaSchedeContatto = GetList();
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
        public List<SchedaContatto> GetSchedeContattoTimeSpan(DateTime dataDa, DateTime dataA)
        {
            return GetList().FindAll(x => x.DataInserimento >= dataDa && x.DataInserimento <= dataA);
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto che hanno lo stato a letta
        /// </summary>
        /// <param name="letta">booleana letta</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoLetta(bool letta)
        {
            return GetList().FindAll(x => x.Letta.Equals(letta));
        }

        /// <summary>
        ///   Metodo che restituisce tutte le schede contatto che hanno lo stato a gestita
        /// </summary>
        /// <param name="gestita">booleana getsita</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoGestita(bool gestita)
        {
            return GetList().FindAll(x => x.Gestita.Equals(gestita));
        }

        /// <summary>
        ///   Metodo che restituisce le schede contatto di quella classificazione
        /// </summary>
        /// <param name="classificazione">una lista di stringhe</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetSchedeContattoFromListTipo(List<string> classificazione)
        {
            var listaSchedeContatto = GetList();
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
        public List<SchedaContatto> GetSchedeContattoFromText(string testolibero)
        {
            var listaSchede = GetList();

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
            var listaSchede = GetList();
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
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> GetFiltered(string testolibero, bool? gestita, bool? letta, string codiceFiscale, double? rangeOre)
        {
            var listaSchedeFiltrate = GetList();
            if (!string.IsNullOrWhiteSpace(testolibero)) listaSchedeFiltrate = GetSchedeContattoFromText(testolibero);
            if (!string.IsNullOrWhiteSpace(codiceFiscale)) listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.OperatoreChiamata.CodiceFiscale.Equals(codiceFiscale));
            if (gestita.HasValue) listaSchedeFiltrate = listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.Gestita.Equals(gestita));
            if (letta.HasValue) listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.Letta.Equals(letta));
            if (rangeOre.HasValue)
            {
                var dataCorrente = DateTime.UtcNow.AddHours(-(double)rangeOre);
                listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.DataInserimento >= dataCorrente);
            }

            return listaSchedeFiltrate;
        }

        /// <summary>
        ///   Metodo che restituisce il conteggio delle schede contatto in base alla loro classificazione.
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// ///
        /// <returns>InfoNue</returns>
        public InfoNue GetConteggio(string codiceSede)
        {
            var listaSchede = GetSchede(codiceSede);
            var listaSchedeCompetenza = listaSchede.FindAll(x => x.Classificazione.Equals(Competenza));
            var listaSchedeConoscenza = listaSchede.FindAll(x => x.Classificazione.Equals(Conoscenza));
            var listaSchedeDifferibile = listaSchede.FindAll(x => x.Classificazione.Equals(Differibile));
            return new InfoNue
            {
                TotaleSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchede.Count,
                    ContatoreDaGestire = listaSchedeDifferibile.FindAll(x => !x.Gestita).Count,
                },
                CompetenzaSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchedeCompetenza.Count,
                },
                ConoscenzaSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchedeConoscenza.Count,
                },
                DifferibileSchede = new ContatoreNue
                {
                    ContatoreTutte = listaSchedeDifferibile.Count,
                    ContatoreDaGestire = listaSchedeDifferibile.FindAll(x => !x.Gestita).Count,
                }
            };
        }
    }
}
