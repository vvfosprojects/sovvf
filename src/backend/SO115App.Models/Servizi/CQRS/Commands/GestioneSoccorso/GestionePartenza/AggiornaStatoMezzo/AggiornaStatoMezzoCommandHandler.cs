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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
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
        private readonly IUpDateRichiestaAssistenza _upDateRichiesta;

        public AggiornaStatoMezzoCommandHandler(IGetTipologieByCodice getTipologie, IGetStatoMezzi statoMezzi,
                                                IModificaInterventoChiuso modificaGac, IUpdateStatoPartenze updateStatoPartenze,
                                                ISendSTATRIItem sendNewItemSTATRI, ICheckCongruitaPartenze checkCongruita,
                                                IUpDateRichiestaAssistenza upDateRichiesta)
        {
            _updateStatoPartenze = updateStatoPartenze;
            _sendNewItemSTATRI = sendNewItemSTATRI;
            _checkCongruita = checkCongruita;
            _modificaGac = modificaGac;
            _statoMezzi = statoMezzi;
            _getTipologie = getTipologie;
            _upDateRichiesta = upDateRichiesta;
        }

        public void Handle(AggiornaStatoMezzoCommand command)
        {
            var richiesta = command.Richiesta;
            var istante = command.DataOraAggiornamento;

            var ultimoEvento = richiesta.ListaEventi.OfType<AbstractPartenza>().OrderByDescending(e => e.DataOraInserimento).First();
            var partenza = richiesta.Partenze.LastOrDefault(p => p.Partenza.Codice.Equals(command.CodicePartenza));
            var statoAttuale = _statoMezzi.Get(command.CodiciSede, command.IdMezzo).First().StatoOperativo;


            //SE AGGIORNAMENTO
            if (StatoEsistente(richiesta, command.StatoMezzo, command.CodicePartenza))
            {
                switch (command.StatoMezzo)
                {
                    case Costanti.MezzoInViaggio:
                        new AggiornamentoOrarioStato(richiesta, command.IdMezzo, istante, command.IdUtente, "AggiornamentoOrarioStato", partenza.CodicePartenza)
                        {
                            VecchioIstante = richiesta.ListaEventi.ToList().Find(e => e is ComposizionePartenze partenze && partenze.CodicePartenza == command.CodicePartenza).Istante,
                            Note = $"É stato cambiato l'orario dello stato {ultimoEvento.TipoEvento}, dall'orario {ultimoEvento.Istante} all'orario {istante}.",
                            SedeOperatore = command.CodiciSede.First()
                        };
                        richiesta.ListaEventi.ToList().Find(e => e is ComposizionePartenze partenze && partenze.CodicePartenza == command.CodicePartenza).Istante = command.DataOraAggiornamento;
                        break;

                    case Costanti.MezzoSulPosto:
                        new AggiornamentoOrarioStato(richiesta, command.IdMezzo, istante, command.IdUtente, "AggiornamentoOrarioStato", partenza.CodicePartenza)
                        {
                            VecchioIstante = richiesta.ListaEventi.ToList().Find(e => e is ArrivoSulPosto arrivo && arrivo.CodicePartenza == command.CodicePartenza).Istante,
                            Note = $"É stato cambiato l'orario dello stato {ultimoEvento.TipoEvento}, dall'orario {ultimoEvento.Istante} all'orario {istante}.",
                            SedeOperatore = command.CodiciSede.First()
                        };
                        richiesta.ListaEventi.ToList().Find(e => e is ArrivoSulPosto arrivo && arrivo.CodicePartenza == command.CodicePartenza).Istante = command.DataOraAggiornamento;
                        break;

                    case Costanti.MezzoInRientro:
                        new AggiornamentoOrarioStato(richiesta, command.IdMezzo, istante, command.IdUtente, "AggiornamentoOrarioStato", partenza.CodicePartenza)
                        {
                            VecchioIstante = richiesta.ListaEventi.ToList().Find(e => e is PartenzaInRientro rientro && rientro.CodicePartenza == command.CodicePartenza).Istante,
                            Note = $"É stato cambiato l'orario dello stato {ultimoEvento.TipoEvento}, dall'orario {ultimoEvento.Istante} all'orario {istante}.",
                            SedeOperatore = command.CodiciSede.First()
                        };
                        richiesta.ListaEventi.ToList().Find(e => e is PartenzaInRientro rientro && rientro.CodicePartenza == command.CodicePartenza).Istante = command.DataOraAggiornamento;
                        break;
                }

                _upDateRichiesta.UpDate(richiesta);
            }
            else
            {
                string statoMezzoReale = "";

                if (statoAttuale.Equals("In Viaggio"))
                {
                    if (!command.StatoMezzo.Equals("In Viaggio"))
                        statoMezzoReale = command.StatoMezzo;
                }
                else if (statoAttuale.Equals("Sul Posto"))
                {
                    if (command.StatoMezzo.Equals("In Viaggio") || command.StatoMezzo.Equals("Sul Posto"))
                        statoMezzoReale = statoAttuale;

                    if (command.StatoMezzo.Equals("In Rientro") || command.StatoMezzo.Equals("Rientrato"))
                        statoMezzoReale = command.StatoMezzo;
                }
                else if (statoAttuale.Equals("In Rientro"))
                {
                    if (command.StatoMezzo.Equals("In Viaggio") || command.StatoMezzo.Equals("Sul Posto") || command.StatoMezzo.Equals("In Rientro"))
                        statoMezzoReale = statoAttuale;

                    if (command.StatoMezzo.Equals("Rientrato"))
                        statoMezzoReale = command.StatoMezzo;
                }
                else if (statoAttuale.Equals("Rientrato"))
                    statoMezzoReale = statoAttuale;

                richiesta.CambiaStatoPartenza(partenza.Partenza, new CambioStatoMezzo()
                {
                    CodMezzo = command.IdMezzo,
                    Istante = istante,
                    Stato = command.StatoMezzo
                }, _sendNewItemSTATRI, _checkCongruita, command.IdUtente);

                if (command.AzioneIntervento != null && richiesta.lstPartenzeInCorso.Where(p => p.Codice != partenza.Partenza.Codice).Count() == 0)
                {
                    if (command.AzioneIntervento.ToLower().Equals("chiusa"))
                        new ChiusuraRichiesta("", richiesta, istante.AddSeconds(1), richiesta.CodOperatore);
                    else if (command.AzioneIntervento.ToLower().Equals("sospesa"))
                        new RichiestaSospesa("", richiesta, istante.AddSeconds(1), richiesta.CodOperatore);
                }

                //SE CAMBIO ORARIO DI UNO STATO AVVISO GAC
                var dataRientro = richiesta.ListaEventi.OfType<PartenzaRientrata>().LastOrDefault(p => p.CodicePartenza == partenza.CodicePartenza)?.Istante;
                if (command.StatoMezzo.Equals(statoAttuale) && statoAttuale.Equals(Costanti.MezzoInViaggio)) _modificaGac.Send(new ModificaMovimentoGAC()
                {
                    comune = new ComuneGAC() { descrizione = richiesta.Localita.Citta },
                    dataIntervento = richiesta.dataOraInserimento,
                    localita = richiesta.Localita.Indirizzo,
                    latitudine = richiesta.Localita.Coordinate.Latitudine.ToString(),
                    longitudine = richiesta.Localita.Coordinate.Longitudine.ToString(),
                    provincia = new ProvinciaGAC() { descrizione = richiesta.Localita.Provincia },
                    targa = command.IdMezzo.Split('.')[1],
                    tipoMezzo = partenza.Partenza.Mezzo.Codice.Split('.')[0],
                    idPartenza = partenza.Partenza.Codice,
                    numeroIntervento = richiesta.CodRichiesta,
                    autistaUscita = partenza.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica.Equals("DRIVER")).Nominativo,
                    autistaRientro = partenza.Partenza.Terminata ? partenza.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica.Equals("DRIVER")).CodiceFiscale : null,
                    dataRientro = dataRientro,
                    dataUscita = command.DataOraAggiornamento,
                    tipoUscita = new TipoUscita()
                    {
                        codice = richiesta.Tipologie.First(),
                        descrizione = _getTipologie.Get(new List<string>() { richiesta.Tipologie.First() }).First().Descrizione
                    }
                });

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiciSede = command.CodiciSede,
                    CodRichiesta = richiesta.Codice,
                    Richiesta = richiesta,
                    IdUtente = command.IdUtente,
                    DataOraAggiornamento = istante,
                    StatoMezzo = statoMezzoReale,
                    IdMezzo = command.IdMezzo
                });
            }
        }

        private bool StatoEsistente(RichiestaAssistenza richiesta, string statoMezzo, string codicePartenza)
        {
            switch (statoMezzo)
            {
                case Costanti.MezzoInViaggio:
                    if (richiesta.ListaEventi.ToList().FindAll(e => e is ComposizionePartenze partenze && partenze.CodicePartenza == codicePartenza).Count > 0)
                        return true;
                    else
                        return false;

                case Costanti.MezzoSulPosto:
                    if (richiesta.ListaEventi.ToList().FindAll(e => e is ArrivoSulPosto arrivo && arrivo.CodicePartenza == codicePartenza).Count > 0)
                        return true;
                    else
                        return false;

                case Costanti.MezzoInRientro:
                    if (richiesta.ListaEventi.ToList().FindAll(e => e is PartenzaInRientro rientro && rientro.CodicePartenza == codicePartenza).Count > 0)
                        return true;
                    else
                        return false;

                default: 
                    return false;
            }
        }
    }
}
