//-----------------------------------------------------------------------
// <copyright file="SetSchedaContatto.cs" company="CNVVF">
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
using SO115App.Models.Classi.NUE;
using System.Collections.Generic;
using System.IO;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue.Mock
{
    public static class SetSchedaContatto
    {
        private static readonly string filepath = Costanti.NueJson;

        public static List<SchedaContatto> Get()
        {
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<SchedaContatto>>(json);
        }

        public static void Set(List<SchedaContatto> lista)
        {
            var updatedList = JsonConvert.SerializeObject(lista);
            File.WriteAllText(filepath, updatedList);
        }

        public static void SetLetta(string codiceScheda, string codiceSede, string codiceFiscale, bool letta)
        {
            var schedeContatto = Get();

            foreach (var schedaContatto in schedeContatto.FindAll(x => x.CodiceScheda.Equals(codiceScheda)))
            {
                schedaContatto.OperatoreChiamata.CodiceFiscale = codiceFiscale;
                schedaContatto.OperatoreChiamata.CodiceSede = codiceSede;
                schedaContatto.Letta = letta;
            }

            Set(schedeContatto);
        }

        public static void SetGestita(string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            var schedeContatto = Get();

            foreach (var schedaContatto in schedeContatto.FindAll(x => x.CodiceScheda.Equals(codiceScheda)))
            {
                schedaContatto.OperatoreChiamata.CodiceFiscale = codiceFiscale;
                schedaContatto.OperatoreChiamata.CodiceSede = codiceSede;
                schedaContatto.Gestita = gestita;
                if (gestita)
                {
                    schedaContatto.Letta = true;
                }
            }

            Set(schedeContatto);
        }
    }
}
