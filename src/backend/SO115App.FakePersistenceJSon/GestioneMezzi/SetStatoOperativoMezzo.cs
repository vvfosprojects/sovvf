//-----------------------------------------------------------------------
// <copyright file="SetStatoOperativoMezzo.cs" company="CNVVF">
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
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistence.JSon.GestioneMezzi
{
    public class SetStatoOperativoMezzo : ISetStatoOperativoMezzo
    {
        private readonly IGetStatoMezzi _getStatoMezzi;

        public SetStatoOperativoMezzo(IGetStatoMezzi getStatoMezzi)
        {
            _getStatoMezzi = getStatoMezzi;
        }

        public void Set(string codiceSede, string codiceMezzo, string statoOperativo, string idRichiesta)
        {
            var mezzo = new StatoOperativoMezzo
            {
                CodiceMezzo = codiceMezzo,
                CodiceSede = codiceSede,
                StatoOperatico = statoOperativo,
                CodiceRichiesta = idRichiesta,
            };
            var statiOperativiMezzi = _getStatoMezzi.Get(codiceSede);
            if (statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(codiceMezzo)) == null)
            {
                statiOperativiMezzi.Add(mezzo);
            }
            else
            {
                foreach (var statoMezzo in statiOperativiMezzi.FindAll(x => x.CodiceMezzo.Equals(codiceMezzo)))
                {
                    statoMezzo.StatoOperatico = statoOperativo;
                }
            }

            var jsonStatiOperativi = JsonConvert.SerializeObject(statiOperativiMezzi);
            File.WriteAllText(CostantiJson.StatoMezzo, jsonStatiOperativi);
        }
    }
}
