//-----------------------------------------------------------------------
// <copyright file="AggiornaStatoMezzoCommandHandler.cs" company="CNVVF">
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
using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoCommandHandler : ICommandHandler<AggiornaStatoMezzoCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly ISendSTATRIItem _sendNewItemSTATRI;
        private readonly ICheckCongruitaPartenze _checkCongruita;
        private readonly IModificaInterventoChiuso _modificaGac;
        private readonly IGetStatoMezzi _statoMezzi;
        private readonly IGetTipologieByCodice _getTipologie;

        public AggiornaStatoMezzoCommandHandler(IGetTipologieByCodice getTipologie, IGetStatoMezzi statoMezzi,
                                                IModificaInterventoChiuso modificaGac, IUpdateStatoPartenze updateStatoPartenze,
                                                ISendSTATRIItem sendNewItemSTATRI, ICheckCongruitaPartenze checkCongruita)
        {
            _updateStatoPartenze = updateStatoPartenze;
            _sendNewItemSTATRI = sendNewItemSTATRI;
            _checkCongruita = checkCongruita;
            _modificaGac = modificaGac;
            _statoMezzi = statoMezzi;
            _getTipologie = getTipologie;
        }

        public void Handle(AggiornaStatoMezzoCommand command)
        {
            var richiesta = command.Richiesta;
            var dataAdesso = command.DataOraAggiornamento;

            var partenzaDaLavorare = richiesta.Partenze.OrderByDescending(p => p.Istante).FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.IdMezzo));

            var StatoAttualeDelMezzo = partenzaDaLavorare.Partenza.Mezzo.Stato;
            string statoMezzoReale = "";

            if (StatoAttualeDelMezzo.Equals("In Viaggio"))
            {
                if (!command.StatoMezzo.Equals("In Viaggio"))
                    statoMezzoReale = command.StatoMezzo;
            }
            else if (StatoAttualeDelMezzo.Equals("Sul Posto"))
            {
                if (command.StatoMezzo.Equals("In Viaggio") || command.StatoMezzo.Equals("Sul Posto"))
                    statoMezzoReale = StatoAttualeDelMezzo;

                if (command.StatoMezzo.Equals("In Rientro") || command.StatoMezzo.Equals("Rientrato"))
                {
                    statoMezzoReale = command.StatoMezzo;
                }
            }
            else if (StatoAttualeDelMezzo.Equals("In Rientro"))
            {
                if (command.StatoMezzo.Equals("In Viaggio") || command.StatoMezzo.Equals("Sul Posto") || command.StatoMezzo.Equals("In Rientro"))
                    statoMezzoReale = StatoAttualeDelMezzo;

                if (command.StatoMezzo.Equals("Rientrato"))
                    statoMezzoReale = command.StatoMezzo;
            }
            else if (StatoAttualeDelMezzo.Equals("Rientrato"))
                statoMezzoReale = StatoAttualeDelMezzo;

            richiesta.CambiaStatoPartenza(partenzaDaLavorare.Partenza, new CambioStatoMezzo()
            {
                CodMezzo = command.IdMezzo,
                Istante = dataAdesso,
                Stato = command.StatoMezzo
            }, _sendNewItemSTATRI, _checkCongruita);

            if (command.AzioneIntervento != null && richiesta.lstPartenzeInCorso.Where(p => p.Codice != partenzaDaLavorare.Partenza.Codice).Count() == 0)
            {
                if (command.AzioneIntervento.ToLower().Equals("chiusa"))
                    new ChiusuraRichiesta("", richiesta, dataAdesso.AddSeconds(1), richiesta.CodOperatore);
                else if (command.AzioneIntervento.ToLower().Equals("sospesa"))
                    new RichiestaSospesa("", richiesta, dataAdesso.AddSeconds(1), richiesta.CodOperatore);
            }

            //SE CAMBIO ORARIO DI UNO STATO AVVISO GAC
            //var statoAttuale = _statoMezzi.Get(command.CodiciSede, command.IdMezzo).First();
            //if (command.StatoMezzo.Equals(statoAttuale)) _modificaGac.Send(new ModificaMovimentoGAC()
            //{
            //    comune = new ComuneGAC() { descrizione = richiesta.Localita.Citta },
            //    dataIntervento = richiesta.dataOraInserimento,
            //    localita = richiesta.Localita.Indirizzo,
            //    latitudine = richiesta.Localita.Coordinate.Latitudine.ToString(),
            //    longitudine = richiesta.Localita.Coordinate.Longitudine.ToString(),
            //    provincia = new ProvinciaGAC() { descrizione = richiesta.Localita.Provincia },
            //    targa = command.IdMezzo,
            //    tipoMezzo = partenzaDaLavorare.Partenza.Mezzo.Codice.Split('.')[0],
            //    idPartenza = partenzaDaLavorare.Partenza.Codice,
            //    numeroIntervento = richiesta.CodRichiesta,
            //    autistaUscita = partenzaDaLavorare.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica.Equals("DRIVER")).Nominativo,
            //    autistaRientro = partenzaDaLavorare.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica.Equals("DRIVER")).Nominativo,
            //    dataRientro = partenzaDaLavorare.Istante,
            //    dataUscita = partenzaDaLavorare.Istante,
            //    tipoUscita = new TipoUscita()
            //    {
            //        codice = richiesta.Tipologie.First(),
            //        descrizione = _getTipologie.Get(new List<string>() { richiesta.Tipologie.First() }).First().Descrizione
            //    }
            //});

            _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
            {
                CodiciSede = command.CodiciSede,
                CodRichiesta = richiesta.Codice,
                Richiesta = richiesta,
                IdUtente = command.IdUtente,
                DataOraAggiornamento = dataAdesso,
                StatoMezzo = statoMezzoReale,
                IdMezzo = command.IdMezzo
            });
        }
    }
}
