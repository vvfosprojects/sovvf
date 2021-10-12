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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    /// <summary>
    ///   La classe aggiorna i dati dell'intervento (squadre, mezzo e richiesta) in seguito al
    ///   cambio stato di un mezzo sull'intervento
    /// </summary>
    public class UpdateStatoPartenzaExt : IUpdateStatoPartenze
    {
        private readonly ISetStatoOperativoMezzo _setStatoOperativoMezzo;
        private readonly ISetStatoSquadra _setStatoSquadra;
        private readonly IUpDateRichiestaAssistenza _upDateRichiesta;
        private readonly ISetUscitaMezzo _setUscitaMezzo;
        private readonly ISetRientroMezzo _setRientroMezzo;
        private readonly IGetTipologieByCodice _getTipologie;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public UpdateStatoPartenzaExt(ISetStatoOperativoMezzo setStatoOperativoMezzo,
            ISetStatoSquadra setStatoSquadra, IUpDateRichiestaAssistenza upDateRichiesta,
            ISetUscitaMezzo setUscitaMezzo, ISetRientroMezzo setRientroMezzo, IGetTipologieByCodice getTipologie)
        {
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _setStatoSquadra = setStatoSquadra;
            _upDateRichiesta = upDateRichiesta;

            _setRientroMezzo = setRientroMezzo;
            _setUscitaMezzo = setUscitaMezzo;

            _getTipologie = getTipologie;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command, e in seguito al cambio di stato di uno o più
        ///   mezzi aggiorna le informazioni relative alla richiesta a cui quel mezzo è associato
        /// </summary>
        /// <param name="command">il command in ingresso</param>

        public void Update(AggiornaStatoMezzoCommand command)
        {
            _upDateRichiesta.UpDate(command.Richiesta);

            var codiceSedeMezzo = command.CodiciSede.First();

            if (CheckStatoMezzoCronologicamenteOk(command))
            {
                _setStatoOperativoMezzo.Set(codiceSedeMezzo, command.IdMezzo, command.StatoMezzo, command.Richiesta.Codice);

                var dataMovintazione = DateTime.Now;

                var dataIntervento = command.Richiesta.ListaEventi.OfType<Telefonata>().FirstOrDefault(p => p.CodiceRichiesta.Equals(command.Richiesta.Codice)).Istante;
                foreach (var partenza in command.Richiesta.Partenze.Where(c => c.Partenza.Mezzo.Codice == command.IdMezzo))
                {
                    foreach (var squadra in partenza.Partenza.Squadre)
                    {
                        _setStatoSquadra.SetStato(squadra.Codice, command.Richiesta.Id, command.StatoMezzo, codiceSedeMezzo, command.IdMezzo);
                    }

                    if (!partenza.Partenza.Mezzo.Stato.Equals(Costanti.MezzoInUscita))
                    {
                        if (partenza.Partenza.Mezzo.Stato.Equals(Costanti.MezzoInSede) || partenza.Partenza.Mezzo.Stato.Equals(Costanti.MezzoRientrato))
                        {
                            var dataRientro = command.Richiesta.ListaEventi.OfType<PartenzaRientrata>().Last(p => p.CodicePartenza.Equals(partenza.Partenza.Codice)).Istante;

                            _setRientroMezzo.Set(new RientroGAC()
                            {
                                targa = partenza.Partenza.Mezzo.Codice.Split('.')[1],
                                tipoMezzo = partenza.Partenza.Mezzo.Genere,
                                idPartenza = partenza.Partenza.Codice.ToString(),
                                numeroIntervento = command.Richiesta.CodRichiesta,
                                dataIntervento = dataIntervento,
                                dataRientro = dataRientro,
                                autista = partenza.Partenza.Squadre.First().Membri.First(m => m.DescrizioneQualifica == "DRIVER").CodiceFiscale
                            });
                        }
                        else if (partenza.Partenza.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                        {
                            var dataUscita = command.Richiesta.ListaEventi.OfType<ComposizionePartenze>().Last(p => p.Partenza.Codice.Equals(partenza.Partenza.Codice)).Istante;

                            var tipologia = _getTipologie.Get(new List<string> { command.Richiesta.Tipologie.First() }).First();

                            _setUscitaMezzo.Set(new UscitaGAC()
                            {
                                targa = partenza.Partenza.Mezzo.Codice.Split('.')[1],
                                tipoMezzo = partenza.Partenza.Mezzo.Genere,
                                idPartenza = partenza.Partenza.Codice.ToString(),
                                numeroIntervento = command.Richiesta.CodRichiesta,
                                dataIntervento = dataIntervento,
                                dataUscita = dataUscita,
                                autista = partenza.Partenza.Squadre.First().Membri.First(m => m.DescrizioneQualifica == "DRIVER").CodiceFiscale,
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
                                longitudine = command.Richiesta.Localita.Coordinate.Longitudine.ToString()
                            });
                        }
                    }
                }
            }
        }

        private bool CheckStatoMezzoCronologicamenteOk(AggiornaStatoMezzoCommand command)
        {
            var statoAttualeMezzo = command.Richiesta.Partenze.ToList().Find(p => p.CodiceMezzo.Equals(command.IdMezzo)).Partenza.Mezzo.Stato;

            switch (statoAttualeMezzo)
            {
                case "In Viaggio":

                    if (!statoAttualeMezzo.Equals("In Viaggio") && !statoAttualeMezzo.Equals("Sul Posto") && !statoAttualeMezzo.Equals("In Rientro") && !statoAttualeMezzo.Equals("Rientrato"))
                        return true;
                    break;

                case "Sul Posto":
                    if (!statoAttualeMezzo.Equals("Sul Posto") && statoAttualeMezzo.Equals("In Viaggio"))
                        return true;
                    break;

                case "In Rientro":
                    if (!statoAttualeMezzo.Equals("In Rientro") && statoAttualeMezzo.Equals("Sul Posto"))
                        return true;
                    break;

                case "Rientrato":
                    if (!statoAttualeMezzo.Equals("Rientrato") && statoAttualeMezzo.Equals("In Rientro"))
                        return true;
                    break;

                default:
                    return true;
            };

            return true;
        }
    }
}
