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
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using System;
using System.Linq;

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
        private readonly Models.Servizi.Infrastruttura.SistemiEsterni.OPService.ISetStatoSquadra _setStatoSquadraOPService;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public UpdateConfermaPartenzeExt(IUpDateRichiestaAssistenza updateRichiesta, ISetStatoOperativoMezzo setStatoOperativoMezzo,
            ISetStatoSquadra setStatoSquadra, ISetUscitaMezzo setUscitaMezzo, ISetRientroMezzo setRientroMezzo,
            SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService.ISetStatoSquadra setStatoSquadraOPService)
        {
            _updateRichiesta = updateRichiesta;
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _setStatoSquadra = setStatoSquadra;
            _setUscitaMezzo = setUscitaMezzo;
            _setRientroMezzo = setRientroMezzo;
            _setStatoSquadraOPService = setStatoSquadraOPService;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command, e aggiorna i dati relativi alla conferma della partenza
        /// </summary>
        /// <param name="command">il command in ingresso</param>
        /// <returns>ConfermaPartenze</returns>
        public ConfermaPartenze Update(ConfermaPartenzeCommand command)
        {
            var conferma = new ConfermaPartenze();

            _updateRichiesta.UpDate(command.ConfermaPartenze.richiesta);

            var codiceSede = command.ConfermaPartenze.CodiceSede.Split(",", StringSplitOptions.RemoveEmptyEntries)[0];

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                var dataMovintazione = DateTime.UtcNow;

                _setStatoOperativoMezzo.Set(codiceSede, partenza.Mezzo.Codice, partenza.Mezzo.Stato, command.ConfermaPartenze.richiesta.Codice);

                foreach (var squadra in partenza.Squadre)
                {
                    _setStatoSquadra.SetStato(squadra.Codice, command.ConfermaPartenze.IdRichiesta, partenza.Mezzo.Stato, codiceSede, partenza.Mezzo.Codice);

                    //Chiamata OPService per aggiornare lo stato delle Squadre "ALLOCATE" oppure "DEALLOCATE"
                    if (!partenza.Mezzo.Stato.Equals(Costanti.MezzoInUscita))
                    {
                        if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInSede) || partenza.Mezzo.Stato.Equals(Costanti.MezzoRientrato))
                        {
                            var IndexUtente = command.ConfermaPartenze.richiesta.UtPresaInCarico.Count - 1;
                            _setStatoSquadraOPService.SetStatoSquadraOPService(new Models.Classi.ServiziEsterni.OPService.actionDTO()
                            {
                                actionType = "ALLOCATE",
                                createdAt = DateTime.Now,
                                id = squadra.IdOPService,
                                id_chiamata = command.ConfermaPartenze.IdRichiesta,
                                id_mezzi = new string[1] { partenza.Mezzo.Codice },
                                id_sede = command.ConfermaPartenze.CodiceSede.Split('.')[0],
                                id_utente = command.ConfermaPartenze.richiesta.UtPresaInCarico[IndexUtente],
                                spotId = squadra.spotId,
                                spotType = squadra.spotType,
                                version = squadra.version,
                                workshiftId = squadra.workshiftId
                            }
                            );
                        }
                        else if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                        {
                            var IndexUtente = command.ConfermaPartenze.richiesta.UtPresaInCarico.Count - 1;
                            _setStatoSquadraOPService.SetStatoSquadraOPService(new Models.Classi.ServiziEsterni.OPService.actionDTO()
                            {
                                actionType = "DEALLOCATE",
                                createdAt = DateTime.Now,
                                id = squadra.IdOPService,
                                id_chiamata = command.ConfermaPartenze.richiesta.Id,
                                id_mezzi = new string[1] { partenza.Mezzo.Codice },
                                id_sede = command.ConfermaPartenze.CodiceSede.Split('.')[0],
                                id_utente = command.ConfermaPartenze.richiesta.UtPresaInCarico[IndexUtente],
                                spotId = squadra.spotId,
                                spotType = squadra.spotType,
                                version = squadra.version,
                                workshiftId = squadra.workshiftId
                            }
                            );
                        }
                    }
                }

                var dataIntervento = command.Richiesta.ListaEventi.OfType<Telefonata>().FirstOrDefault(p => p.CodiceRichiesta.Equals(command.Richiesta.Codice)).Istante;

                //GAC USCITA/ENTRATA
                if (!partenza.Mezzo.Stato.Equals(Costanti.MezzoInUscita))
                    if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInSede) || partenza.Mezzo.Stato.Equals(Costanti.MezzoRientrato))
                    {
                        var dataRientro = command.Richiesta.ListaEventi.OfType<PartenzaRientrata>().FirstOrDefault(p => p.CodicePartenza.Equals(partenza.Codice)).Istante;
                        _setRientroMezzo.Set(new RientroGAC()
                        {
                            targa = partenza.Mezzo.Codice.Split('.')[1],
                            tipoMezzo = partenza.Mezzo.Codice.Split('.')[0],
                            idPartenza = partenza.Codice.ToString(),
                            numeroIntervento = command.Richiesta.CodRichiesta,
                            dataIntervento = dataIntervento,
                            dataRientro = dataRientro,
                            autista = ""
                        });
                    }
                    else if (partenza.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                    {
                        var dataUscita = command.Richiesta.ListaEventi.OfType<UscitaPartenza>().Select(p => p.DataOraInserimento).Min();
                        _setUscitaMezzo.Set(new UscitaGAC()
                        {
                            targa = partenza.Mezzo.Codice.Split('.')[1],
                            tipoMezzo = partenza.Mezzo.Codice.Split('.')[0],
                            idPartenza = partenza.Codice.ToString(),
                            numeroIntervento = command.Richiesta.CodRichiesta,
                            dataIntervento = dataIntervento,
                            dataUscita = dataUscita,
                            autista = "",
                            tipoUscita = new TipoUscita()
                            {
                                codice = "",
                                descrizione = "Servizio"
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
            }

            conferma.CodiceSede = command.ConfermaPartenze.CodiceSede;
            conferma.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
            conferma.richiesta = command.ConfermaPartenze.richiesta;
            return conferma;
        }
    }
}
