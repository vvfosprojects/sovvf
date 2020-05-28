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
using MongoDB.Driver;
using Newtonsoft.Json;
using Persistence.MongoDB;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.NUE;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue.Mock
{
    /// <summary>
    ///   Servizio che mocka tutti i servizi di scrittura sul NUE (Scheda Contatto).
    /// </summary>
    public class SetSchedaContatto
    {
        private readonly string filepath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.NueJson);
        private readonly DbContext _context;

        public SetSchedaContatto(DbContext context)
        {
            _context = context;
        }

        /// <summary>
        ///   Metodo che restituisce la lista di tutte le schede contatto sul json
        /// </summary>
        public List<SchedaContatto> Get()
        {
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<SchedaContatto>>(json);
        }

        /// <summary>
        ///   Metodo che aggiorna la lista delle schede contatto sul Json accettanto in firma la
        ///   lista delle schede contatto.
        /// </summary>
        /// <param name="lista">La lista di schede contatto</param>
        public void Set(List<SchedaContatto> lista, string codiceSchedaModificata)
        {
            var updatedList = JsonConvert.SerializeObject(lista);
            File.WriteAllText(filepath, updatedList);

            var ListaSchedeRaggruppate = _context.SchedeContattoCollection.Find(Builders<SchedaContatto>.Filter.Empty).ToList();

            foreach (SchedaContatto scheda in lista)
            {
                if (scheda.CodiceScheda.Equals(codiceSchedaModificata))
                {
                    if (ListaSchedeRaggruppate.Exists(x => x.CodiceScheda.Equals(scheda.CodiceScheda)))
                    {
                        _context.SchedeContattoCollection.UpdateOne(Builders<SchedaContatto>.Filter.Eq("codiceScheda", scheda.CodiceScheda), Builders<SchedaContatto>.Update.Set("gestita", scheda.Gestita));
                    }
                }
            }
        }

        /// <summary>
        ///   Metodo che aggiorna la stato della scheda contatto in gestita e di conseguenza in letta
        /// </summary>
        /// <param name="codiceScheda">il codice della scheda contatto</param>
        /// <param name="codiceSede">il codice sede dell'operatore</param>
        /// <param name="codiceFiscale">il codice fiscale dell'operatore</param>
        /// <param name="gestita">la booleana gestita</param>
        public void SetGestita(string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            var schedeContatto = Get();

            foreach (var schedaContatto in schedeContatto.FindAll(x => x.CodiceScheda.Equals(codiceScheda)))
            {
                schedaContatto.OperatoreChiamata.CodiceFiscale = codiceFiscale;
                schedaContatto.OperatoreChiamata.CodiceSede = codiceSede;
                schedaContatto.Gestita = gestita;
            }

            Set(schedeContatto, codiceScheda);
        }
    }
}
