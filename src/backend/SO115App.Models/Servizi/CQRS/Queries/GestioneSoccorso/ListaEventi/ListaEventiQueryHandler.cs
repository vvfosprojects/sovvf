//-----------------------------------------------------------------------
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
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GetListaEventi;
using System.Collections.Generic;

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

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public ListaEventiQueryHandler(IGetListaEventi iEventi)
        {
            this._iEventi = iEventi;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public ListaEventiResult Handle(ListaEventiQuery query)
        {
            var eventi = _iEventi.Get(query);
            var eventiMapper = new List<MapperEventoSuEventoGui>();
            foreach (var evento in eventi)
            {
                var eventoMapper = new MapperEventoSuEventoGui
                {
                    NomeClasseEvento = MapEvento(evento),
                    IstanteEvento = evento.Istante,
                    Targa = MapTarghe(evento),
                    Note = "",
                    HTMLLinkElement = ""
                };
                eventiMapper.Add(eventoMapper);
            }
            return new ListaEventiResult()
            {
                Eventi = eventiMapper
            };
        }

        private string MapTarghe(Evento evento)
        {
            var targa = "";

            if (evento is ComposizionePartenze)
            {
                targa = ((ComposizionePartenze)evento).Partenza.Mezzo.Descrizione;
            }

            return targa;
        }

        private string MapEvento(Evento evento)
        {
            var risEvento = Costanti.EventoGenerico;

            switch (evento)
            {
                case Telefonata _:
                    risEvento = Costanti.Telefonata;
                    break;

                case InizioPresaInCarico _:
                    risEvento = Costanti.InizioPresaInCarico;
                    break;

                case RiaperturaRichiesta _:
                    risEvento = Costanti.RiaperturaRichiesta;
                    break;

                case ComposizionePartenze _:
                    risEvento = Costanti.ComposizionePartenze;
                    break;

                case ChiusuraRichiesta _:
                    risEvento = Costanti.ChiusuraRichiesta;
                    break;

                case ArrivoSulPosto _:
                    risEvento = Costanti.ArrivoSulPosto;
                    break;

                case RichiestaPresidiata _:
                    risEvento = Costanti.RichiestaPresidiata;
                    break;

                case RichiestaSospesa _:
                    risEvento = Costanti.RichiestaSospesa;
                    break;

                case PartenzaRientrata _:
                    risEvento = Costanti.PartenzaRientrata;
                    break;

                case PartenzaInRientro _:
                    risEvento = Costanti.PartenzaInRientro;
                    break;

                case AssegnataRichiesta _:
                    risEvento = Costanti.AssegnataRichiesta;
                    break;

                case AssegnazionePriorita _:
                    risEvento = Costanti.AssegnataPriorita;
                    break;

                case MarcaRilevante _:
                    risEvento = Costanti.MarcaRilevante;
                    break;
            }

            return risEvento;
        }
    }
}
