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
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        private readonly IGetPosizioneByCodiceMezzo _getPosizioneByCodiceMezzo;

        public AggiornaStatoMezzoCommandHandler(IGetTipologieByCodice getTipologie, IGetStatoMezzi statoMezzi,
                                                IModificaInterventoChiuso modificaGac, IUpdateStatoPartenze updateStatoPartenze,
                                                ISendSTATRIItem sendNewItemSTATRI, ICheckCongruitaPartenze checkCongruita,
                                                IUpDateRichiestaAssistenza upDateRichiesta, IGetPosizioneByCodiceMezzo getPosizioneByCodiceMezzo)
        {
            _updateStatoPartenze = updateStatoPartenze;
            _sendNewItemSTATRI = sendNewItemSTATRI;
            _checkCongruita = checkCongruita;
            _modificaGac = modificaGac;
            _statoMezzi = statoMezzi;
            _getTipologie = getTipologie;
            _upDateRichiesta = upDateRichiesta;
            _getPosizioneByCodiceMezzo = getPosizioneByCodiceMezzo;
        }

        public void Handle(AggiornaStatoMezzoCommand command)
        {
            const string orarioErrato = "1* L'orario inserito è errato.";
            var richiesta = command.Richiesta;
            var istante = command.DataOraAggiornamento;

            _checkCongruita.CheckCongruenza(new CambioStatoMezzo { CodMezzo = command.IdMezzo, Istante = istante }, command.CodicePartenza, true);

            var ultimoEvento = richiesta.ListaEventi.OfType<AbstractPartenza>().OrderByDescending(e => e.DataOraInserimento).First();
            var partenza = richiesta.Partenze.LastOrDefault(p => p.Partenza.Codice.Equals(command.CodicePartenza));
            var statoAttuale = _statoMezzi.Get(command.CodiciSede, command.CodicePartenza, command.IdMezzo).FirstOrDefault()?.StatoOperativo;

            //STATI PARTENZA ATTUALE
            var Composizione = richiesta.ListaEventi.ToList().Find(e => e is ComposizionePartenze partenze && partenze.CodicePartenza == command.CodicePartenza)?.Istante;
            var Uscita = richiesta.ListaEventi.ToList().FirstOrDefault(e => e is UscitaPartenza arrivo && arrivo.CodicePartenza == command.CodicePartenza)?.Istante;
            var SulPosto = richiesta.ListaEventi.ToList().FirstOrDefault(e => e is ArrivoSulPosto rientro && rientro.CodicePartenza == command.CodicePartenza)?.Istante;
            var InRientro = richiesta.ListaEventi.ToList().FirstOrDefault(e => e is PartenzaInRientro rientro && rientro.CodicePartenza == command.CodicePartenza)?.Istante;
            var Rientrato = richiesta.ListaEventi.ToList().FirstOrDefault(e => e is PartenzaRientrata rientro && rientro.CodicePartenza == command.CodicePartenza)?.Istante;

            //SE AGGIORNAMENTO
            if (StatoEsistente(richiesta, command.StatoMezzo, command.CodicePartenza))
            {
                switch (command.StatoMezzo)
                {
                    case Costanti.MezzoInViaggio:

                        if (istante > DateTime.UtcNow)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario attuale.");

                        //if (Composizione > istante)
                        //    throw new System.Exception("1* L'orario inserito non può essere superiore all'orario di uscita del mezzo.");

                        if (SulPosto < istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario di arrivo sul posto del mezzo.");
                        if (InRientro < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario in rientro del mezzo.");
                        if (Rientrato < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario di rientro del mezzo.");

                        new AggiornamentoOrarioStato(richiesta, command.IdMezzo, istante, command.IdUtente, "AggiornamentoOrarioStato", partenza.CodicePartenza)
                        {
                            VecchioIstante = Composizione.Value,
                            Note = $"É stato cambiato l'orario dello stato {ultimoEvento.TipoEvento}, dall'orario {ultimoEvento.Istante} all'orario {istante}.",
                            SedeOperatore = command.CodiciSede.First()
                        };

                        richiesta.ListaEventi.ToList().Find(e => e is ComposizionePartenze partenze && partenze.CodicePartenza == command.CodicePartenza).Istante = command.DataOraAggiornamento;

                        break;

                    case Costanti.MezzoSulPosto:

                        if (InRientro < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario in rientro del mezzo.");
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario di partenza.");
                        if (Rientrato < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario di rientro del mezzo.");

                        new AggiornamentoOrarioStato(richiesta, command.IdMezzo, istante, command.IdUtente, "AggiornamentoOrarioStato", partenza.CodicePartenza)
                        {
                            VecchioIstante = SulPosto.Value,
                            Note = $"É stato cambiato l'orario dello stato {ultimoEvento.TipoEvento}, dall'orario {ultimoEvento.Istante} all'orario {istante}.",
                            SedeOperatore = command.CodiciSede.First()
                        };

                        richiesta.ListaEventi.ToList().Find(e => e is ArrivoSulPosto arrivo && arrivo.CodicePartenza == command.CodicePartenza).Istante = command.DataOraAggiornamento;

                        break;

                    case Costanti.MezzoInRientro:

                        if (SulPosto > istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario sul posto.");
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario di partenza.");
                        if (Rientrato < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario di rientro del mezzo.");

                        new AggiornamentoOrarioStato(richiesta, command.IdMezzo, istante, command.IdUtente, "AggiornamentoOrarioStato", partenza.CodicePartenza)
                        {
                            VecchioIstante = InRientro.Value,
                            Note = $"É stato cambiato l'orario dello stato {ultimoEvento.TipoEvento}, dall'orario {ultimoEvento.Istante} all'orario {istante}.",
                            SedeOperatore = command.CodiciSede.First()
                        };

                        richiesta.ListaEventi.ToList().Find(e => e is PartenzaInRientro rientro && rientro.CodicePartenza == command.CodicePartenza).Istante = command.DataOraAggiornamento;

                        break;

                    case Costanti.MezzoRientrato:

                        if (SulPosto > istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario sul posto.");
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario di partenza.");
                        if (InRientro > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo rientrato.");

                        new AggiornamentoOrarioStato(richiesta, command.IdMezzo, istante, command.IdUtente, "AggiornamentoOrarioStato", partenza.CodicePartenza)
                        {
                            VecchioIstante = Rientrato.Value,
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

                try
                {
                    var posizione = _getPosizioneByCodiceMezzo.Get(partenza.Partenza.Mezzo.Codice).Result;
                    if (posizione != null)
                    {
                        partenza.Partenza.Coordinate = posizione.ToCoordinate().ToCoordinateString();
                        partenza.Partenza.Mezzo.Coordinate = posizione.ToCoordinate();
                        partenza.Partenza.Mezzo.CoordinateStrg = new string[2] { posizione.ToCoordinate().ToCoordinateString().Latitudine, posizione.ToCoordinate().ToCoordinateString().Longitudine };
                    }
                    else
                    {
                        partenza.Partenza.Coordinate = richiesta.Localita.Coordinate.ToCoordinateString();
                        partenza.Partenza.Mezzo.Coordinate = richiesta.Localita.Coordinate;
                        partenza.Partenza.Mezzo.CoordinateStrg = new string[2] { richiesta.Localita.Coordinate.ToCoordinateString().Latitudine, richiesta.Localita.Coordinate.ToCoordinateString().Longitudine };

                    }
                }
                catch
                {

                    partenza.Partenza.Coordinate = richiesta.Localita.Coordinate.ToCoordinateString();
                    partenza.Partenza.Mezzo.Coordinate = richiesta.Localita.Coordinate;
                    partenza.Partenza.Mezzo.CoordinateStrg = new string[2] { richiesta.Localita.Coordinate.ToCoordinateString().Latitudine, richiesta.Localita.Coordinate.ToCoordinateString().Longitudine };
                }

                if (statoAttuale.Equals("In Viaggio"))
                {
                    if (istante > DateTime.UtcNow)
                        throw new System.Exception("1* L'orario inserito non può essere superiore all'orario attuale.");

                    if (command.StatoMezzo.Equals("Sul Posto"))
                    {
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");
                    }

                    if (command.StatoMezzo.Equals("In Rientro"))
                    {
                        if (Composizione > istante)
                            throw new System.Exception("L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");
                    }

                    if (command.StatoMezzo.Equals("Rientrato"))
                    {
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");
                    }

                    statoMezzoReale = command.StatoMezzo;
                    richiesta.CambiaStatoPartenza(partenza.Partenza, new CambioStatoMezzo()
                    {
                        CodMezzo = command.IdMezzo,
                        Istante = istante,
                        Stato = statoMezzoReale
                    }, _sendNewItemSTATRI, _checkCongruita, command.IdUtente, new string[2] { partenza.Partenza.Coordinate.Latitudine, partenza.Partenza.Coordinate.Longitudine }, partenza.Partenza.Codice);

                }
                else if (statoAttuale.Equals("Sul Posto"))
                {
                    if (command.StatoMezzo.Equals("In Rientro"))
                    {
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");

                        if (SulPosto > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario di arrivo sul posto del mezzo.");

                        statoMezzoReale = command.StatoMezzo;
                    }

                    if (command.StatoMezzo.Equals("Rientrato"))
                    {
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");

                        if (SulPosto > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario di arrivo sul posto.");

                        if (InRientro > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario in rientro del mezzo.");

                        statoMezzoReale = command.StatoMezzo;
                    }

                    richiesta.CambiaStatoPartenza(partenza.Partenza, new CambioStatoMezzo()
                    {
                        CodMezzo = command.IdMezzo,
                        Istante = istante,
                        Stato = statoMezzoReale
                    }, _sendNewItemSTATRI, _checkCongruita, command.IdUtente, new string[2] { partenza.Partenza.Coordinate.Latitudine, partenza.Partenza.Coordinate.Longitudine }, partenza.Partenza.Codice);


                }
                else if (statoAttuale.Equals("In Rientro"))
                {
                    if (command.StatoMezzo.Equals("Sul Posto"))
                    {
                        if (InRientro < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario in rientro del mezzo.");

                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");

                        statoMezzoReale = statoAttuale;
                        new ArrivoSulPosto(richiesta, command.IdMezzo, istante, command.IdUtente, partenza.CodicePartenza);
                    }

                    if (command.StatoMezzo.Equals("Rientrato"))
                    {
                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");

                        if (SulPosto > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario sul posto del mezzo.");

                        if (InRientro > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario in rientro del mezzo.");

                        statoMezzoReale = command.StatoMezzo;
                        richiesta.CambiaStatoPartenza(partenza.Partenza, new CambioStatoMezzo()
                        {
                            CodMezzo = command.IdMezzo,
                            Istante = istante,
                            Stato = statoMezzoReale
                        }, _sendNewItemSTATRI, _checkCongruita, command.IdUtente, new string[2] { partenza.Partenza.Coordinate.Latitudine, partenza.Partenza.Coordinate.Longitudine }, partenza.Partenza.Codice);

                    }
                }
                else if (statoAttuale.Equals("Rientrato"))
                {
                    if (command.StatoMezzo.Equals("Sul Posto"))
                    {
                        if (Rientrato < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario del mezzo rientrato.");

                        if (InRientro < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario in rientro del mezzo.");

                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario del mezzo in viaggio.");

                        statoMezzoReale = statoAttuale;
                        new ArrivoSulPosto(richiesta, command.IdMezzo, istante, command.IdUtente, partenza.CodicePartenza);
                    }

                    if (command.StatoMezzo.Equals("In Rientro"))
                    {
                        if (Rientrato < istante)
                            throw new System.Exception("1* L'orario inserito non può essere superiore all'orario del mezzo rientrato.");

                        if (SulPosto > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario sul posto del mezzo.");

                        if (Composizione > istante)
                            throw new System.Exception("1* L'orario inserito non può essere inferiore all'orario di uscita del mezzo.");

                        statoMezzoReale = command.StatoMezzo;
                    }
                }

                if (command.AzioneIntervento != null && richiesta.lstPartenzeInCorso.Where(p => p.Codice != partenza.Partenza.Codice).Count() == 0)
                {
                    if (command.AzioneIntervento.ToLower().Equals("chiusa"))
                        new ChiusuraRichiesta("", richiesta, istante.AddSeconds(1), richiesta.CodOperatore);
                    else if (command.AzioneIntervento.ToLower().Equals("sospesa"))
                        new RichiestaSospesa("", richiesta, istante.AddSeconds(1), richiesta.CodOperatore);
                }

                //SE CAMBIO ORARIO DI UNO STATO AVVISO GAC
                var dataRientro = richiesta.ListaEventi.OfType<PartenzaRientrata>().LastOrDefault(p => p.CodicePartenza == partenza.CodicePartenza)?.Istante;

                Task.Run(() =>
                {
                    if (command.StatoMezzo.Equals(statoAttuale) && statoAttuale.Equals(Costanti.MezzoInViaggio))
                    {
                        _modificaGac.Send(new ModificaMovimentoGAC()
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
                                codice = richiesta.Tipologie.Select(t => t.Codice).First(),
                                descrizione = _getTipologie.Get(new List<string>() { richiesta.Tipologie.Select(t => t.Codice).First() }).First().Descrizione
                            }
                        });
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
                    IdMezzo = command.IdMezzo,
                    CodicePartenza = command.CodicePartenza
                });
            }
        }

        private static bool StatoEsistente(RichiestaAssistenza richiesta, string statoMezzo, string codicePartenza)
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
