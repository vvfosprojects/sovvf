//-----------------------------------------------------------------------
// <copyright file="SetMezzo.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac.Mock
{
    /// <summary>
    ///   Servizio mock scrive la movimentazione del mezzo sul servizio esterno GAC fake.
    /// </summary>
    public class SetMezzo
    {
        private readonly string MezzoJson = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.GacJson);

        /// <summary>
        ///   metodo che scrive la movimentazione sul mock json
        /// </summary>
        /// <param name="codice">il codice del mezzo in movimentaizone</param>
        /// <param name="idRichiesta">il codice della richiesta</param>
        /// <param name="statoOperativo">lo stato operativo del mezzo</param>
        /// <param name="dataMovimentazione">la data di inizio movimentazione</param>
        public void SetMovimentazione(string codice, string idRichiesta, string statoOperativo, DateTime dataMovimentazione)
        {
            string json;

            using (var r = new StreamReader(MezzoJson))
            {
                json = r.ReadToEnd();
            }

            var listaMezzi = JsonConvert.DeserializeObject<List<MezzoDTO>>(json);

            foreach (var mezzo in listaMezzi)
            {
                if (mezzo.CodiceMezzo.Equals(codice))
                {
                    mezzo.Movimentazione.DataMovimentazione = dataMovimentazione;
                    mezzo.Movimentazione.IdRichiesta = idRichiesta;
                    mezzo.Movimentazione.StatoOperativo = statoOperativo;
                }
            }

            var updatedListaMezzi = JsonConvert.SerializeObject(listaMezzi);
            File.WriteAllText(MezzoJson, updatedListaMezzi);
        }
    }
}
