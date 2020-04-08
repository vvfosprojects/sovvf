//-----------------------------------------------------------------------
// <copyright file="GetMezzi.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac.Mock
{
    /// <summary>
    ///   Servizio che mocka tutti i servizi di lettura del gac (anagrafica mezzi).
    /// </summary>
    public class GetMezzi
    {
        private readonly string MezzoJson = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.GacJson);
        private const string FuoriServizio = "Fuori Servizio";

        /// <summary>
        ///   metodo che recupera tutti i mezzi dal json Mezzo.
        /// </summary>
        public List<MezzoDTO> Get()
        {
            string json;

            using (var r = new StreamReader(MezzoJson))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<MezzoDTO>>(json);
        }

        /// <summary>
        ///   metodo che restituisce la lista dei mezzi fake
        /// </summary>
        /// <param name="codiceSedi">una lista di codici sede</param>
        /// <param name="genereMezzo">il genere del mezzo (opzionale)</param>
        /// <param name="siglaMezzo">la sigla del mezzo (opzionale)</param>
        /// <returns>una lista mezzi</returns>
        public List<MezzoDTO> GetMezziUtilizzabili(List<string> codiceSedi, string genereMezzo, string siglaMezzo)
        {
            var listaMezzi = Get().FindAll(x => x.Movimentazione.StatoOperativo != FuoriServizio);
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var sede in codiceSedi)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (sede.Equals(mezzo.CodiceDistaccamento))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }

            if (!string.IsNullOrWhiteSpace(genereMezzo) && !string.IsNullOrWhiteSpace(siglaMezzo)) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo) && x.Descrizione.Equals(siglaMezzo));
            if (!string.IsNullOrWhiteSpace(genereMezzo)) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo));
            if (!string.IsNullOrWhiteSpace(siglaMezzo)) return listaMezziFromSede.FindAll(x => x.Descrizione.Equals(siglaMezzo));

            return listaMezziFromSede;
        }

        /// <summary>
        ///   Restituisce la lista fake dei mezzi fuori servizio
        /// </summary>
        /// <param name="codiceSedi">una lista di codici sede</param>
        /// <param name="genereMezzo">il genere del mezzo (opzionale)</param>
        /// <param name="siglaMezzo">la sigla del mezzo (opzionale)</param>
        /// <returns>una lista mezzi</returns>
        public List<MezzoDTO> GetMezziFuoriServizio(List<string> codiceSedi, string genereMezzo, string siglaMezzo)
        {
            var listaMezzi = Get().FindAll(x => x.Movimentazione.StatoOperativo == FuoriServizio);
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var sede in codiceSedi)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (sede.Equals(mezzo.CodiceDistaccamento))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }
            if (!string.IsNullOrWhiteSpace(genereMezzo) && !string.IsNullOrWhiteSpace(siglaMezzo)) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo) && x.Descrizione.Equals(siglaMezzo));
            if (!string.IsNullOrWhiteSpace(genereMezzo)) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo));
            if (!string.IsNullOrWhiteSpace(siglaMezzo)) return listaMezziFromSede.FindAll(x => x.Descrizione.Equals(siglaMezzo));

            return listaMezziFromSede;
        }

        /// <summary>
        ///   Restituisce la lista fake dei mezzi dal json a partire dal iccid
        /// </summary>
        /// <param name="iccid">una lista di codici iccid</param>
        /// <returns>una lista mezzi</returns>
        public List<MezzoDTO> GetMezziFromICCID(List<string> iccid)
        {
            var listaMezzi = Get();
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var codice in iccid)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (codice.Equals(mezzo.ICCID))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }

            return listaMezziFromSede;
        }

        /// <summary>
        ///   metodo che recupera dal json tutti mezzi a partire dall'id radio
        /// </summary>
        /// <param name="radioId">una lista di codici radio</param>
        /// <returns>una lista mezzi</returns>
        public List<MezzoDTO> GetMezziFromRadioId(List<string> radioId)
        {
            var listaMezzi = Get();
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var codice in radioId)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (codice.Equals(mezzo.IdRadio))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }
            return listaMezziFromSede;
        }

        /// <summary>
        ///   Restituisce la lista fake dei mezzi dal json
        /// </summary>
        /// <param name="codiciMezzo">una lista di codici mezzo</param>
        /// <returns>una lista mezzi DTO</returns>
        public List<MezzoDTO> GetMezziFromCodiceMezzo(List<string> codiciMezzo)
        {
            var listaMezzi = Get();
            var listaMezziFromCodici = new List<MezzoDTO>();

            foreach (var codice in codiciMezzo)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (codice.Equals(mezzo.CodiceMezzo))
                    {
                        listaMezziFromCodici.Add(mezzo);
                    }
                }
            }
            return listaMezziFromCodici;
        }
    }
}
