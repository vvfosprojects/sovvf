//-----------------------------------------------------------------------
// <copyright file="GetRichiesteMarker.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetRichiesteMarker : IGetRichiesteMarker
    {
        public List<SintesiRichiestaMarker> GetListaRichiesteMarker()
        {
            List<SintesiRichieste> ListaSintesiRichieste = new List<SintesiRichieste>();

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSintesiRichieste = JsonConvert.DeserializeObject<List<SintesiRichieste>>(json);

            if (ListaSintesiRichieste != null)
            {
                List<SintesiRichiestaMarker> ListaRichiesteMarker = new List<SintesiRichiestaMarker>();

                int id = 1;
                foreach (SintesiRichieste sintesi in ListaSintesiRichieste)
                {
                    sintesi.Id = id.ToString();
                    sintesi.Stato = MapStatoRichiesta(sintesi);
                    id++;
                }

                ListaRichiesteMarker = MapSintesiSuMarker(ListaSintesiRichieste);

                return ListaRichiesteMarker;
            }
            else
            {
                List<SintesiRichiestaMarker> ListaRichiesteVuota = new List<SintesiRichiestaMarker>();
                return ListaRichiesteVuota;
            }
        }

        private List<SintesiRichiestaMarker> MapSintesiSuMarker(List<SintesiRichieste> listaSintesiRichieste)
        {
            List<SintesiRichiestaMarker> ListaMarker = new List<SintesiRichiestaMarker>();

            foreach (SintesiRichieste sintesi in listaSintesiRichieste)
            {
                SintesiRichiestaMarker marker = new SintesiRichiestaMarker(sintesi.Id, sintesi.Codice, sintesi.CodiceRichiesta, sintesi.Localita, sintesi.Tipologie,
                                                                           sintesi.Descrizione, sintesi.PrioritaRichiesta, sintesi.Rilevanza, sintesi.Stato);

                ListaMarker.Add(marker);
            }

            return ListaMarker;
        }

        private int MapStatoRichiesta(SintesiRichieste sintesi)
        {
            /*
            Controlli sui codici
            Se lo stato è 0 - InAttesa
            Se lo stato è 1 - Sospesa
            Se lo stato è 2 - Presidiata
            Se lo stato è 3 - Assegnata
            Se lo stato è 4 - Chiusa
            */

            int stato = 0;

            if (sintesi.Chiusa)
                stato = 4;

            if (sintesi.Sospesa)
                stato = 1;

            if (sintesi.Aperta)
            {
                if (sintesi.Presidiato)
                    stato = 2;
                else if (sintesi.IstantePrimaAssegnazione != null)
                    stato = 3;
            }

            return stato;
        }
    }
}
