//-----------------------------------------------------------------------
// <copyright file="UpDateRichiesta.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.GestioneIntervento
{
    /// <summary>
    ///   La classe aggiorna i dati dell'intervento qualora l'intervento sia stato chiuso o riaperto
    /// </summary>
    public class UpDateRichiesta : IUpDateRichiestaAssistenza
    {
        /// <summary>
        ///   Il metodo accetta in firma la richiesta, e in seguito alla chiusura o riapertura della
        ///   richiesta aggiorna i dati relativi a quella richiesta
        /// </summary>
        /// <param name="richiestaAssistenza">la richiesta assistenza</param>
        public void UpDate(RichiestaAssistenza richiestaAssistenza)
        {
            var filepath = CostantiJson.ListaRichiesteAssistenza;
            var filePathSquadre = CostantiJson.SquadreComposizione;
            var filePathMezzi = CostantiJson.Mezzo;

            var listaRichiesteNew = new List<RichiestaAssistenza>();

            string json;
            string jsonSquadre;
            string jsonMezzi;

            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            using (var r = new StreamReader(filePathSquadre))
            {
                jsonSquadre = r.ReadToEnd();
            }

            using (StreamReader r = new StreamReader(filePathMezzi))
            {
                jsonMezzi = r.ReadToEnd();
            }

            var listaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);
            var listaSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(jsonSquadre);
            var listaMezzi = JsonConvert.DeserializeObject<List<Mezzo>>(jsonMezzi);

            if (listaRichieste != null)
            {
                foreach (var richiesta in listaRichieste)
                {
                    if (richiesta.Cod != richiestaAssistenza.Codice)
                        listaRichiesteNew.Add(MapperDTO.MapRichiestaDTOtoRichiesta(richiesta));
                }

                listaRichiesteNew.Add(richiestaAssistenza);

                var jsonListaPresente = JsonConvert.SerializeObject(listaRichiesteNew);
                File.WriteAllText(CostantiJson.ListaRichiesteAssistenza, jsonListaPresente);
            }
            else
            {
                listaRichiesteNew.Add(richiestaAssistenza);

                var jsonNew = JsonConvert.SerializeObject(listaRichiesteNew);
                File.WriteAllText(CostantiJson.ListaRichiesteAssistenza, jsonNew);
            }

            foreach (var partenza in richiestaAssistenza.Partenze)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (mezzo.Codice == partenza.Partenza.Mezzo.Codice)
                    {
                        mezzo.Stato = partenza.Partenza.Mezzo.Stato;
                    }
                }

                foreach (var composizioneSquadra in listaSquadre)
                {
                    foreach (var squadra in partenza.Partenza.Squadre)
                    {
                        if (composizioneSquadra.Squadra.Id == squadra.Id)
                        {
                            composizioneSquadra.Squadra.Stato = squadra.Stato;
                        }
                    }
                }
            }

            var jsonListaMezzi = JsonConvert.SerializeObject(listaMezzi);
            File.WriteAllText(CostantiJson.Mezzo, jsonListaMezzi);
            var jsonListaSquadre = JsonConvert.SerializeObject(listaSquadre);
            File.WriteAllText(CostantiJson.SquadreComposizione, jsonListaSquadre);
        }
    }
}
