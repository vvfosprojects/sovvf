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
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        private readonly IGetTurno _getTurno;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public UpdateStatoPartenzaExt(ISetStatoOperativoMezzo setStatoOperativoMezzo,
            ISetStatoSquadra setStatoSquadra, IUpDateRichiestaAssistenza upDateRichiesta,
            ISetUscitaMezzo setUscitaMezzo, ISetRientroMezzo setRientroMezzo, IGetTipologieByCodice getTipologie,
            IGetTurno getTurno)
        {
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _setStatoSquadra = setStatoSquadra;
            _upDateRichiesta = upDateRichiesta;

            _setRientroMezzo = setRientroMezzo;
            _setUscitaMezzo = setUscitaMezzo;

            _getTipologie = getTipologie;

            _getTurno = getTurno;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command, e in seguito al cambio di stato di uno o più
        ///   mezzi aggiorna le informazioni relative alla richiesta a cui quel mezzo è associato
        /// </summary>
        /// <param name="command">il command in ingresso</param>

        public void Update(AggiornaStatoMezzoCommand command)
        {
            string turnoAttuale = _getTurno.Get().Codice.Substring(0, 1);

            _upDateRichiesta.UpDate(command.Richiesta);

            var codiceSedeMezzo = command.CodiciSede.First();

            if (CheckStatoMezzoCronologicamenteOk(command))
            {
                var partenzaRientro = command.Richiesta.Partenze.Last(p => p.CodiceMezzo.Equals(command.IdMezzo));
                var dataIntervento = command.Richiesta.ListaEventi.OfType<Telefonata>().FirstOrDefault(p => p.CodiceRichiesta.Equals(command.Richiesta.Codice)).Istante;

                if (partenzaRientro.Partenza.Mezzo.Stato.Equals(Costanti.MezzoRientrato))
                {
                    var dataRientro = command.Richiesta.ListaEventi.OfType<PartenzaRientrata>().Last(p => p.CodicePartenza.Equals(partenzaRientro.Partenza.Codice)).Istante;

                    Task.Run(() => _setRientroMezzo.Set(new RientroGAC()
                    {
                        targa = partenzaRientro.Partenza.Mezzo.Codice.Split('.')[1],
                        tipoMezzo = partenzaRientro.CodiceMezzo.Split('.')[0],
                        idPartenza = partenzaRientro.Partenza.Codice.ToString(),
                        numeroIntervento = command.Richiesta.CodRichiesta,
                        dataIntervento = dataIntervento,
                        dataRientro = dataRientro,
                        autista = partenzaRientro.Partenza.Squadre.First().Membri.First(m => m.DescrizioneQualifica == "DRIVER").CodiceFiscale
                    }));
                }

                _setStatoOperativoMezzo.Set(codiceSedeMezzo, command.IdMezzo, command.StatoMezzo, command.Richiesta.Codice);

                
                    foreach (var partenza in command.Richiesta.Partenze.Where(c => c.Partenza.Mezzo.Codice == command.IdMezzo && !c.Partenza.Terminata))
                    {
                        foreach (var squadra in partenza.Partenza.Squadre)
                        {
                            if(squadra.Turno!=null)
                                _setStatoSquadra.SetStato(squadra.Codice, $"{squadra.Codice}_{squadra.Turno}", command.Richiesta.CodRichiesta, command.StatoMezzo, squadra.Distaccamento.Codice, command.IdMezzo, turnoAttuale, squadra.Turno);
                            else
                                _setStatoSquadra.SetStato(squadra.Codice, $"{squadra.Codice}_{partenza.Partenza.Turno.Substring(0, 1)}", command.Richiesta.CodRichiesta, command.StatoMezzo, codiceSedeMezzo, command.IdMezzo, turnoAttuale, partenza.Partenza.Turno.Substring(0, 1));
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
