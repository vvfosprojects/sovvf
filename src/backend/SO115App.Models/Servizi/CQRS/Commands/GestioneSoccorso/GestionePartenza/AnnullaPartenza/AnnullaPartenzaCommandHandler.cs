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
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza
{
    public class AnnullaPartenzaCommandHandler : ICommandHandler<AnnullaPartenzaCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly IGetStatoMezzi _getStatoMezzi;

        private readonly ISendNewItemSTATRI _statri;
        private readonly ICheckCongruitaPartenze _check;

        private readonly IModificaInterventoChiuso _modificaGAC;

        public AnnullaPartenzaCommandHandler(IUpdateStatoPartenze updateStatoPartenze, IGetStatoMezzi getStatoMezzi, ISendNewItemSTATRI statri, ICheckCongruitaPartenze check)
        {
            _updateStatoPartenze = updateStatoPartenze;
            _getStatoMezzi = getStatoMezzi;
            _statri = statri;
            _check = check;
        }

        public void Handle(AnnullaPartenzaCommand command)
        {
            string statoMezzo = _getStatoMezzi.Get(command.CodiciSedi, command.TargaMezzo).First().StatoOperativo;

            if(!new string[] { Costanti.MezzoInViaggio, Costanti.MezzoRientrato }.Contains(statoMezzo))
            {
                var date = DateTime.UtcNow;
                string nuovoStatoMezzo = Costanti.MezzoInRientro;
                string nomeAzione = "AnnullamentoPartenza";

                new AnnullamentoPartenza(command.Richiesta, command.TargaMezzo, date, command.IdOperatore, nomeAzione, command.CodicePartenza);

                var partenza = command.Richiesta.lstPartenze.Find(p => p.Codice.Equals(command.CodicePartenza));

                command.Richiesta.CambiaStatoPartenza(partenza, new CambioStatoMezzo()
                {
                    Istante = date,
                    CodMezzo = command.TargaMezzo,
                    Stato = nuovoStatoMezzo
                }, _statri, _check);

                //SEGNALO LA MODIFICA A GAC
                var movimento = new ModificaMovimentoGAC()
                {
                    targa = command.TargaMezzo,
                    autistaRientro = partenza.Squadre.First().Membri.First(m => m.DescrizioneQualifica.Equals("DRIVER")).CodiceFiscale,
                    autistaUscita = partenza.Squadre.First().Membri.First(m => m.DescrizioneQualifica.Equals("DRIVER")).CodiceFiscale,
                    dataIntervento = command.Richiesta.dataOraInserimento,
                    dataRientro = date,
                    dataUscita = command.Richiesta.ListaEventi.OfType<UscitaPartenza>().First(p => p.CodicePartenza.Equals(command.CodicePartenza)).DataOraInserimento,
                    idPartenza = command.CodicePartenza,
                    latitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                    longitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                    numeroIntervento = command.Richiesta.CodRichiesta,
                    tipoMezzo = partenza.Mezzo.Genere,
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
                        codice = "",
                        descrizione = command.Richiesta.Tipologie.First()
                    }
                };

                _modificaGAC.Send(movimento);

                //AGGIORNO STATO MEZZO E RICHIESTA
                var commandStatoMezzo = new AggiornaStatoMezzoCommand()
                {
                    Richiesta = command.Richiesta,
                    CodiciSede = command.CodiciSedi, 
                    Chiamata = command.Chiamata,
                    CodRichiesta = command.IdRichiesta,
                    DataOraAggiornamento = date,
                    IdMezzo = command.TargaMezzo,
                    IdUtente = command.IdOperatore,
                    StatoMezzo = nuovoStatoMezzo,
                    AzioneIntervento = "AnnullamentoPartenza"
                };

                _updateStatoPartenze.Update(commandStatoMezzo);
            }
        }
    }
}
