﻿//-----------------------------------------------------------------------
// <copyright file="ListaEventiQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using Serilog;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.GetListaEventi;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.ListaEventi
{
    /// <summary>
    ///   Query per l'accesso alla lista delle richieste di assistenza "di interesse". Quali sono le
    ///   richieste interessanti è specificato dal DTO di input. Ecco alcuni esempi di ricerca, in
    ///   base ai valori contenuti nel DTO di input:
    ///   <para>
    ///     - DTO vuoto: vengono selezionate le prime 10 richieste aperte più recenti, appartenenti
    ///     all'unità operativa a cui fa capo l'utente autenticato;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una lista di unità operative: vengono selezionate le prime 10 richieste
    ///     aperte più recenti, appartenenti alle unità operative indicate dal DTO;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una stringa chiave: la ricerca restituisce le prime 10 richieste più
    ///     rilevanti rispetto al testo chiave (full-text search);
    ///   </para>
    ///   <para>
    ///     - DTO contenente un riferimento geo-referenziato: la ricerca restituisce le prime 10
    ///     richieste più vicine al riferimento;
    ///   </para>
    ///   <para>
    ///     - DTO contenente un array di stati richiesta: la ricerca restituisce le prime 10 richieste
    ///     negli stati specificati.
    ///   </para>
    /// </summary>
    public class ListaEventiQueryHandler : IQueryHandler<ListaEventiQuery, ListaEventiResult>
    {
        private readonly IGetListaEventi _iEventi;
        private readonly IGetUtenteById _getUtenteById;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public ListaEventiQueryHandler(IGetListaEventi iEventi, IGetUtenteById getUtenteById)
        {
            this._iEventi = iEventi;
            this._getUtenteById = getUtenteById;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public ListaEventiResult Handle(ListaEventiQuery query)
        {
            Log.Debug("Inizio elaborazione Lista Eventi Handler");

            var eventi = _iEventi.Get(query);
            var eventiMapper = new List<MapperEventoSuEventoGui>();
            foreach (var evento in eventi)
            {
                var operatore = _getUtenteById.GetUtenteByCodice(evento.CodiceFonte);
                var eventoMapper = new MapperEventoSuEventoGui
                {
                    NomeClasseEvento = MapEvento(evento),
                    IstanteEvento = evento.Istante,
                    Targa = MapTarghe(evento),
                    Note = MapNote(evento),
                    Operatore = operatore.Nome + " " + operatore.Cognome
                };
                eventiMapper.Add(eventoMapper);
            }

            Log.Debug("Fine elaborazione Lista Eventi Handler");

            return new ListaEventiResult()
            {
                Eventi = eventiMapper.OrderByDescending(x => x.IstanteEvento).ToList()
            };
        }

        private string MapNote(Evento evento)
        {
            switch (evento)
            {
                case RevocaPerAltraMotivazione _:
                    return ((RevocaPerAltraMotivazione)evento).Motivazione;

                case RevocaPerSostituzioneMezzo _:
                    return ((RevocaPerSostituzioneMezzo)evento).Motivazione;

                case RevocaPerRiassegnazione _:
                    string codRichiesta;
                    if (((RevocaPerRiassegnazione)evento).RichiestaSubentrata.CodRichiesta.Trim().Length > 0)
                        return ((RevocaPerRiassegnazione)evento).RichiestaSubentrata.CodRichiesta;
                    else
                        return ((RevocaPerRiassegnazione)evento).RichiestaSubentrata.Codice;

                case SostituzionePartenzaFineTurno _:
                    return ((SostituzionePartenzaFineTurno)evento).Note;

                case TrasferimentoChiamata _:
                    return ((TrasferimentoChiamata)evento).Note;

                case RichiestaSoccorsoAereo _:
                    return ((RichiestaSoccorsoAereo)evento).Note;

                case AnnullamentoRichiestaSoccorsoAereo _:
                    return ((AnnullamentoRichiestaSoccorsoAereo)evento).Note;

                case ChiusuraRichiesta _:
                    return ((ChiusuraRichiesta)evento).Motivazione;

                case AllertaSedi _:

                default:
                    return "";
            }
        }

        private string MapTarghe(Evento evento)
        {
            var targa = "";

            if (evento is RevocaPerSostituzioneMezzo)
            {
                targa = ((RevocaPerSostituzioneMezzo)evento).CodiceMezzo;
            }

            if (evento is ComposizionePartenze)
            {
                targa = ((ComposizionePartenze)evento).Partenza.Mezzo.Codice;
            }

            if (evento is ArrivoSulPosto)
            {
                targa = ((ArrivoSulPosto)evento).CodiceMezzo;
            }

            if (evento is UscitaPartenza)
            {
                targa = ((UscitaPartenza)evento).CodiceMezzo;
            }

            if (evento is PartenzaInRientro)
            {
                targa = ((PartenzaInRientro)evento).CodiceMezzo;
            }

            if (evento is PartenzaRientrata)
            {
                targa = ((PartenzaRientrata)evento).CodiceMezzo;
            }

            if (evento is RevocaPerAltraMotivazione)
            {
                targa = ((RevocaPerAltraMotivazione)evento).CodiceMezzo;
            }
            if (evento is RevocaPerFuoriServizio)
            {
                targa = ((RevocaPerFuoriServizio)evento).CodiceMezzo;
            }
            if (evento is RevocaPerInterventoNonPiuNecessario)
            {
                targa = ((RevocaPerInterventoNonPiuNecessario)evento).CodiceMezzo;
            }
            if (evento is RevocaPerRiassegnazione)
            {
                targa = ((RevocaPerRiassegnazione)evento).CodiceMezzo;
            }
            if (evento is SostituzionePartenzaFineTurno)
            {
                targa = ((SostituzionePartenzaFineTurno)evento).CodiceMezzo;
            }
            if (evento is RichiestaSoccorsoAereo)
            {
                targa = ((RichiestaSoccorsoAereo)evento).Targa;
            }
            if (evento is AnnullamentoRichiestaSoccorsoAereo)
            {
                targa = ((AnnullamentoRichiestaSoccorsoAereo)evento).Targa;
            }

            return targa.Contains('.') ? targa.Split('.')[1] : targa;
        }

        private string MapEvento(Evento evento)
        {
            switch (evento)
            {
                case Telefonata _:
                    return Costanti.Telefonata;

                case InizioPresaInCarico _:
                    return Costanti.InizioPresaInCarico;

                case RiaperturaRichiesta _:
                    return Costanti.RiaperturaRichiesta;

                case ComposizionePartenze _:
                    return Costanti.Composizione;

                case ChiusuraRichiesta _:
                    return Costanti.ChiusuraRichiesta;

                case ArrivoSulPosto _:
                    return Costanti.ArrivoSulPosto;

                case UscitaPartenza _:
                    return Costanti.UscitaPartenza;

                case RichiestaPresidiata _:
                    return Costanti.RichiestaPresidiata;

                case RichiestaSospesa _:
                    return Costanti.RichiestaSospesa;

                case PartenzaRientrata _:
                    return Costanti.EventoMezzoRientrato;

                case PartenzaInRientro _:
                    return Costanti.EventoMezzoInRientro;

                case AssegnataRichiesta _:
                    return Costanti.AssegnataRichiesta;

                case AssegnazionePriorita _:
                    return Costanti.AssegnataPriorita;

                case MarcaRilevante _:
                    return Costanti.MarcaRilevante;

                case RevocaPerAltraMotivazione _:
                    return Costanti.RevocaPerAltraMotivazione;

                case RevocaPerFuoriServizio _:
                    return Costanti.RevocaPerFuoriServizio;

                case RevocaPerInterventoNonPiuNecessario _:
                    return Costanti.RevocaPerInterventoNonPiuNecessario;

                case RevocaPerRiassegnazione _:
                    return Costanti.RevocaPerRiassegnazione;

                case AnnullamentoPresaInCarico _:
                    return Costanti.AnnullamentoPresaInCarico;

                case InviareFonogramma _:
                    return Costanti.FonogrammaDaInviare;

                case FonogrammaInviato _:
                    return Costanti.FonogrammaInviato;

                case AllertaSedi _:
                    return Costanti.AllertaAltreSedi;

                case RevocaPerSostituzioneMezzo _:
                    return Costanti.RevocaPerSostituzioneMezzo;

                case SostituzionePartenzaFineTurno _:
                    return Costanti.SostituzionePartenza;

                case TrasferimentoChiamata _:
                    return Costanti.TrasferimentoChiamata;

                case RichiestaSoccorsoAereo _:
                    return Costanti.RichiestaSoccorsoAereo;

                case AnnullamentoRichiestaSoccorsoAereo _:
                    return Costanti.AnnullamentoRichiestaSoccorsoAereo;

                default:
                    return Costanti.EventoGenerico;
            }
        }
    }
}
