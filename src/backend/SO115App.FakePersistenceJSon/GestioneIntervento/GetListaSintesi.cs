//-----------------------------------------------------------------------
// <copyright file="GetListaSintesi.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetListaSintesi : IGetListaSintesi
    {
        public List<SintesiRichieste> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            List<SintesiRichieste> ListaSintesiRichieste = new List<SintesiRichieste>();

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSintesiRichieste = JsonConvert.DeserializeObject<List<SintesiRichieste>>(json);

            int id = 1;

            if (ListaSintesiRichieste != null)
            {
                foreach (SintesiRichieste sintesi in ListaSintesiRichieste)
                {
                    sintesi.Id = id.ToString();
                    sintesi.Stato = MapStatoRichiesta(sintesi);
                    id++;
                }

                ListaSintesiRichieste = ListaSintesiRichieste.OrderByDescending(x => x.IstanteRicezioneRichiesta).OrderBy(x => x.Stato).ToList();

                return ListaSintesiRichieste;
            }
            else
            {
                List<SintesiRichieste> ListaSintesiRichiesteVuota = new List<SintesiRichieste>();
                return ListaSintesiRichiesteVuota;
            }
        }

        private string MapStatoRichiesta(SintesiRichieste sintesi)
        {
            string stato = "Chiamata";

            if (sintesi.Chiusa)
                stato = "Chiusa";

            if (sintesi.Sospesa)
                stato = "Sospesa";

            if (sintesi.Aperta)
            {
                if (sintesi.Presidiato)
                    stato = "Presidiata";
                else if (sintesi.IstantePrimaAssegnazione != null)
                    stato = "Assegnata";
            }

            return stato;
        }
    }
}
