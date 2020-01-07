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

using System;
using System.Collections.Generic;
using System.IO;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    /// <summary>
    ///   La classe aggiorna i dati relativi alle squadre, ai mezzi e alla partenza di una richiesta
    ///   in seguito ad un command
    /// </summary>
    public class UpdateConfermaPartenzeExt : IUpdateConfermaPartenze
    {
        private readonly ISetMovimentazione _setMovimentazione;
        private readonly ISetStatoOperativoMezzo _setStatoOperativoMezzo;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public UpdateConfermaPartenzeExt(ISetMovimentazione setMovimentazione, ISetStatoOperativoMezzo setStatoOperativoMezzo)
        {
            _setMovimentazione = setMovimentazione;
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command, e aggiorna i dati relativi alla conferma della partenza
        /// </summary>
        /// <param name="command">il command in ingresso</param>
        /// <returns>ConfermaPartenze</returns>
        public ConfermaPartenze Update(ConfermaPartenzeCommand command)
        {
            var filepath = CostantiJson.ListaRichiesteAssistenza;
            var filePathSquadre = CostantiJson.SquadreComposizione;
            string json;
            string jsonSquadre;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            using (var r = new StreamReader(filePathSquadre))
            {
                jsonSquadre = r.ReadToEnd();
            }

            var richiestaDTO = new RichiestaAssistenzaDTO();
            var conferma = new ConfermaPartenze();
            var listaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);
            var listaSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(jsonSquadre);
            var listaRichiesteNew = new List<RichiestaAssistenza>();

            if (listaRichieste != null)
            {
                richiestaDTO = listaRichieste.Find(x => x.Codice == command.ConfermaPartenze.richiesta.Codice);
                listaRichieste.Remove(richiestaDTO);

                foreach (var richiesta in listaRichieste)
                {
                    listaRichiesteNew.Add(MapperDTO.MapRichiestaDTOtoRichiesta(richiesta));
                }

                listaRichiesteNew.Add(command.ConfermaPartenze.richiesta);

                var jsonListaPresente = JsonConvert.SerializeObject(listaRichiesteNew);
                File.WriteAllText(CostantiJson.ListaRichiesteAssistenza, jsonListaPresente);
            }
            else
            {
                listaRichiesteNew = new List<RichiestaAssistenza>
                {
                    command.ConfermaPartenze.richiesta
                };

                var jsonNew = JsonConvert.SerializeObject(listaRichiesteNew);
                File.WriteAllText(CostantiJson.ListaRichiesteAssistenza, jsonNew);
            }

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                var dataMovintazione = DateTime.UtcNow;

                _setMovimentazione.Set(partenza.Mezzo.Codice, command.ConfermaPartenze.IdRichiesta, Costanti.MezzoInViaggio, dataMovintazione);
                _setStatoOperativoMezzo.Set(command.ConfermaPartenze.CodiceSede, partenza.Mezzo.Codice, Costanti.MezzoInViaggio, command.ConfermaPartenze.IdRichiesta);

                foreach (var composizioneSquadra in listaSquadre)
                {
                    foreach (var squadra in partenza.Squadre)
                    {
                        if (composizioneSquadra.Squadra.Id == squadra.Id)
                        {
                            composizioneSquadra.Squadra.Stato = Squadra.StatoSquadra.InViaggio;
                        }
                    }
                }
            }

            var jsonListaSquadre = JsonConvert.SerializeObject(listaSquadre);
            File.WriteAllText(CostantiJson.SquadreComposizione, jsonListaSquadre);

            conferma.CodiceSede = command.ConfermaPartenze.CodiceSede;
            conferma.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
            conferma.richiesta = command.ConfermaPartenze.richiesta;
            return conferma;
        }
    }
}
