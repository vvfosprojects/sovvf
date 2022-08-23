//-----------------------------------------------------------------------
// <copyright file="AddInterventoNotifier.cs" company="CNVVF">
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
using CQRS.Commands.Notifiers;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaStatoPartenza
{
    public class AnnullaStatoPartenzaNotifier : ICommandNotifier<AnnullaStatoPartenzaCommand>
    {
        private readonly INotifyAnnullaPartenza _sender;
        private readonly IModificaInterventoChiuso _modificaGAC;
        private readonly IGetTipologieByCodice _getTipologie;

        public AnnullaStatoPartenzaNotifier(INotifyAnnullaPartenza sender, IModificaInterventoChiuso modificaGAC,
                                            IGetTipologieByCodice getTipologie)
        {
            _sender = sender;
            _modificaGAC = modificaGAC;
            _getTipologie = getTipologie;
        }

        public void Notify(AnnullaStatoPartenzaCommand command)
        {
            _sender.SendNotification(command);

            #region Chiamata GAC

            var tipologia = _getTipologie.Get(new List<string> { command.Richiesta.Tipologie.Select(t => t.Codice).First() }).First();
            var partenza = command.Richiesta.ListaEventi.OfType<ComposizionePartenze>().Single(p => p.CodicePartenza.Equals(command.CodicePartenza));
            var adesso = DateTime.UtcNow;
            //SEGNALO LA MODIFICA A GAC
            Task.Run(() =>
            {
                var movimento = new ModificaMovimentoGAC()
                {
                    targa = command.TargaMezzo.Split('.')[1],
                    autistaRientro = partenza.Partenza.Squadre.First().Membri.FirstOrDefault(m => m.DescrizioneQualifica.Equals("DRIVER"))?.CodiceFiscale,
                    autistaUscita = partenza.Partenza.Squadre.First().Membri.FirstOrDefault(m => m.DescrizioneQualifica.Equals("DRIVER"))?.CodiceFiscale,
                    dataIntervento = command.Richiesta.dataOraInserimento,
                    dataRientro = adesso,
                    dataUscita = command.Richiesta.ListaEventi.OfType<UscitaPartenza>().First(p => p.CodicePartenza.Equals(command.CodicePartenza)).DataOraInserimento,
                    idPartenza = command.CodicePartenza,
                    latitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                    longitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                    numeroIntervento = command.Richiesta.CodRichiesta,
                    tipoMezzo = partenza.Partenza.Mezzo.Codice.Split('.')[0],
                    localita = "",
                    comune = new ComuneGAC()
                    {
                        codice = "",
                        descrizione = command.Richiesta.Localita.Citta
                    },
                    provincia = new ProvinciaGAC()
                    {
                        codice = "",
                        descrizione = command.Richiesta.Localita.Provincia
                    },
                    tipoUscita = new TipoUscita()
                    {
                        codice = tipologia.Codice,
                        descrizione = tipologia.Descrizione
                    }
                };

                _modificaGAC.Send(movimento);
            });

            #endregion Chiamata GAC
        }
    }
}
