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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;
using System.Collections.Generic;
using System.IO;

namespace SO115App.ExternalAPI.Fake.GestioneIntervento
{
    /// <summary>
    ///   La classe aggiorna i dati dell'intervento qualora l'intervento sia stato chiuso o riaperto
    /// </summary>
    public class UpDateRichiestaExt : IUpDateRichiestaAssistenza
    {
        private readonly ISetMovimentazione _setMovimentazione;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;

        public UpDateRichiestaExt(ISetMovimentazione setMovimentazione, IUpDateRichiestaAssistenza upDateRichiestaAssistenza)
        {
            _setMovimentazione = setMovimentazione;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
        }

        /// <summary>
        ///   Il metodo accetta in firma la richiesta, e in seguito alla chiusura o riapertura della
        ///   richiesta aggiorna i dati relativi a quella richiesta
        /// </summary>
        /// <param name="richiestaAssistenza">la richiesta assistenza</param>
        public void UpDate(RichiestaAssistenza richiestaAssistenza)
        {
            var filePathSquadre = CostantiJson.SquadreComposizione;
            var dataMovimentazione = DateTime.UtcNow;

            string jsonSquadre;
            using (var r = new StreamReader(filePathSquadre))
            {
                jsonSquadre = r.ReadToEnd();
            }

            var listaSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(jsonSquadre);

            _upDateRichiestaAssistenza.UpDate(richiestaAssistenza);

            foreach (var partenza in richiestaAssistenza.Partenze)
            {
                _setMovimentazione.Set(partenza.Partenza.Mezzo.Codice, partenza.CodiceRichiesta, partenza.Partenza.Mezzo.Stato, dataMovimentazione);

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

            var jsonListaSquadre = JsonConvert.SerializeObject(listaSquadre);
            File.WriteAllText(CostantiJson.SquadreComposizione, jsonListaSquadre);
        }
    }
}
