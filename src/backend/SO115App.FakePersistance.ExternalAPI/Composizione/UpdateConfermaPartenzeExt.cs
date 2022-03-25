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
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    /// <summary>
    ///   La classe aggiorna i dati relativi alle squadre, ai mezzi e alla partenza di una richiesta
    ///   in seguito ad un command
    /// </summary>
    public class UpdateConfermaPartenzeExt : IUpdateConfermaPartenze
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;
        private readonly ISetStatoOperativoMezzo _setStatoOperativoMezzo;
        private readonly ISetStatoSquadra _setStatoSquadra;
        private readonly ISetUscitaMezzo _setUscitaMezzo;
        private readonly ISetRientroMezzo _setRientroMezzo;
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly Models.Servizi.Infrastruttura.SistemiEsterni.OPService.ISetStatoSquadra _setStatoSquadraOPService;

        public UpdateConfermaPartenzeExt(IUpDateRichiestaAssistenza updateRichiesta, ISetStatoOperativoMezzo setStatoOperativoMezzo,
            ISetStatoSquadra setStatoSquadra, ISetUscitaMezzo setUscitaMezzo, ISetRientroMezzo setRientroMezzo,
            SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService.ISetStatoSquadra setStatoSquadraOPService, IGetTipologieByCodice getTipologie)
        {
            _updateRichiesta = updateRichiesta;
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _setStatoSquadra = setStatoSquadra;
            _setUscitaMezzo = setUscitaMezzo;
            _setRientroMezzo = setRientroMezzo;
            _setStatoSquadraOPService = setStatoSquadraOPService;
            _getTipologie = getTipologie;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command, e aggiorna i dati relativi alla conferma della partenza
        /// </summary>
        /// <param name="command">il command in ingresso</param>
        /// <returns>ConfermaPartenze</returns>
        public ConfermaPartenze Update(ConfermaPartenzeCommand command)
        {
            var codiceSede = command.ConfermaPartenze.CodiceSede.Split(",", StringSplitOptions.RemoveEmptyEntries)[0];

            Parallel.ForEach(command.ConfermaPartenze.Partenze, partenza =>
            {
                var dataIntervento = command.Richiesta.ListaEventi.OfType<Telefonata>().FirstOrDefault(p => p.CodiceRichiesta.Equals(command.Richiesta.Codice)).Istante;

                //GAC USCITA/ENTRATA
                if (!partenza.Mezzo.Stato.Equals(Costanti.MezzoInUscita))
                    if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInSede) || partenza.Mezzo.Stato.Equals(Costanti.MezzoRientrato))
                    {
                        var dataRientro = command.Richiesta.ListaEventi.OfType<PartenzaRientrata>().Last(p => p.CodiceMezzo.Equals(partenza.Mezzo.Codice)).Istante;
                        _setRientroMezzo.Set(new RientroGAC()
                        {
                            targa = partenza.Mezzo.Codice.Split('.')[1],
                            tipoMezzo = partenza.Mezzo.Codice.Split('.')[0],
                            idPartenza = partenza.Codice.ToString(),
                            numeroIntervento = command.Richiesta.CodRichiesta,
                            dataIntervento = dataIntervento,
                            dataRientro = dataRientro,
                            autista = partenza.Squadre.First().Membri.FirstOrDefault(m => m.DescrizioneQualifica == "DRIVER")?.CodiceFiscale,
                        });
                    }
                    else if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                    {
                        var dataUscita = command.Richiesta.ListaEventi.OfType<UscitaPartenza>().Last(p => p.CodicePartenza.Equals(partenza.Codice)).Istante;

                        var tipologia = _getTipologie.Get(new List<string> { command.Richiesta.Tipologie.Select(c => c.Codice).First() }).First();

                        _setUscitaMezzo.Set(new UscitaGAC()
                        {
                            targa = partenza.Mezzo.Codice.Split('.')[1],
                            tipoMezzo = partenza.Mezzo.Codice.Split('.')[0],
                            idPartenza = partenza.Codice.ToString(),
                            numeroIntervento = command.Richiesta.CodRichiesta,
                            dataIntervento = dataIntervento,
                            dataUscita = dataUscita,
                            autista = partenza.Squadre.First().Membri.FirstOrDefault(m => m.DescrizioneQualifica == "DRIVER")?.CodiceFiscale,
                            tipoUscita = new TipoUscita()
                            {
                                codice = tipologia.Codice,
                                descrizione = tipologia.Descrizione
                            },
                            comune = new ComuneGAC()
                            {
                                codice = "",
                                descrizione = command.Richiesta.Localita.Citta,
                            },
                            provincia = new Models.Classi.Gac.ProvinciaGAC()
                            {
                                codice = "",
                                descrizione = command.Richiesta.Localita.Provincia
                            },
                            localita = command.Richiesta.Localita.Citta,
                            latitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                            longitudine = command.Richiesta.Localita.Coordinate.Longitudine.ToString(),
                        });
                    }

                if (partenza.Mezzo.Distaccamento?.Codice != null)
                    _setStatoOperativoMezzo.Set(partenza.Mezzo.Distaccamento?.Codice, partenza.Mezzo.Codice, partenza.Mezzo.Stato, command.Richiesta.Codice);
                else if (partenza.Mezzo.Appartenenza != null)
                    _setStatoOperativoMezzo.Set(partenza.Mezzo.Appartenenza, partenza.Mezzo.Codice, partenza.Mezzo.Stato, command.Richiesta.Codice);

                Parallel.ForEach(partenza.Squadre, squadra =>
                {
                    //Chiamata OPService per aggiornare lo stato delle Squadre "ALLOCATE" oppure "DEALLOCATE"
                    if (!partenza.Mezzo.Stato.Equals(Costanti.MezzoInUscita))
                    {
                        if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInSede) || partenza.Mezzo.Stato.Equals(Costanti.MezzoRientrato))
                        {
                            var IndexUtente = command.Richiesta.UtPresaInCarico.Count - 1;

                            _setStatoSquadraOPService.SetStatoSquadraOPService(new Models.Classi.ServiziEsterni.OPService.actionDTO()
                            {
                                actionType = "ALLOCATE",
                                createdAt = DateTime.Now,
                                id = squadra.IdOPService,
                                id_chiamata = command.ConfermaPartenze.IdRichiesta,
                                id_mezzi = new string[1] { partenza.Mezzo.Codice },
                                id_sede = command.ConfermaPartenze.CodiceSede.Split('.')[0],
                                id_utente = command.Richiesta.UtPresaInCarico[IndexUtente],
                                spotId = squadra.spotId,
                                spotType = squadra.spotType,
                                version = squadra.version,
                                workshiftId = squadra.workshiftId
                            });
                        }
                        else if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                        {
                            var IndexUtente = command.Richiesta.UtPresaInCarico.Count - 1;

                            _setStatoSquadraOPService.SetStatoSquadraOPService(new Models.Classi.ServiziEsterni.OPService.actionDTO()
                            {
                                actionType = "DEALLOCATE",
                                createdAt = DateTime.Now,
                                id = squadra.IdOPService,
                                id_chiamata = command.Richiesta.Id,
                                id_mezzi = new string[1] { partenza.Mezzo.Codice },
                                id_sede = command.ConfermaPartenze.CodiceSede.Split('.')[0],
                                id_utente = command.Richiesta.UtPresaInCarico[IndexUtente],
                                spotId = squadra.spotId,
                                spotType = squadra.spotType,
                                version = squadra.version,
                                workshiftId = squadra.workshiftId
                            });
                        }
                    }

                    if (partenza.Mezzo.Distaccamento.Codice != null)
                        _setStatoSquadra.SetStato(squadra.Codice, command.ConfermaPartenze.IdRichiesta, partenza.Mezzo.Stato, squadra.Distaccamento.Codice, partenza.Mezzo.Codice, partenza.Turno);
                    else if (partenza.Mezzo.Appartenenza != null)
                        _setStatoSquadra.SetStato(squadra.Codice, command.ConfermaPartenze.IdRichiesta, partenza.Mezzo.Stato, squadra.Distaccamento.Codice, partenza.Mezzo.Codice, partenza.Turno);
                });
            });

            _updateRichiesta.UpDate(command.Richiesta);

            var conferma = new ConfermaPartenze()
            {
                CodiceSede = command.ConfermaPartenze.CodiceSede,
                IdRichiesta = command.ConfermaPartenze.IdRichiesta,
                richiesta = command.Richiesta,
                Partenze = command.ConfermaPartenze.Partenze
            };

            return conferma;
        }
    }
}
