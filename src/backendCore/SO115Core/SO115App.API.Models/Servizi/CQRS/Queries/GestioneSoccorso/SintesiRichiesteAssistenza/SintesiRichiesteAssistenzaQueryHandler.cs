//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesteAssistenzaQueryHandler.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Fonogramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.QueryDTO;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.ResultDTO;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Classi.Soccorso;
using System.Web;
using System.Linq;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;

using Newtonsoft.Json;
using SimpleInjector;
using SO115App.API.Models.Servizi.Infrastruttura;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza
{
    /// <summary>
    ///   Query per l'accesso alla lista delle richieste di assistenza "di interesse". Quali sono le
    ///   richieste interessanti è specificato dal DTO di input. Ecco alcuni esempi di ricerca, in
    ///   base ai valori contenuti nel DTO di input:
    ///   <para>
    ///     - DTO vuoto: vengono selezionate le prime 10 richieste aperte più recenti, appartenenti
    ///       all'unità operativa a cui fa capo l'utente autenticato;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una lista di unità operative: vengono selezionate le prime 10 richieste
    ///       aperte più recenti, appartenenti alle unità operative indicate dal DTO;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una stringa chiave: la ricerca restituisce le prime 10 richieste più
    ///       rilevanti rispetto al testo chiave (full-text search);
    ///   </para>
    ///   <para>
    ///     - DTO contenente un riferimento geo-referenziato: la ricerca restituisce le prime 10
    ///       richieste più vicine al riferimento;
    ///   </para>
    ///   <para>
    ///     - DTO contenente un array di stati richiesta: la ricerca restituisce le prime 10
    ///       richieste negli stati specificati.
    ///   </para>
    /// </summary>
    public class SintesiRichiesteAssistenzaQueryHandler : IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult>
    {
        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly ICercaRichiesteAssistenza cercaRichiesteAssistenza;
 
        private readonly ILogger logger;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="cercaRichiesteAssistenza">L'istanza del servizio</param>
        public SintesiRichiesteAssistenzaQueryHandler(ILogger logger,ICercaRichiesteAssistenza cercaRichiesteAssistenza)
        {
            this.logger = logger;
            this.cercaRichiesteAssistenza = cercaRichiesteAssistenza;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public SintesiRichiesteAssistenzaResult Handle(SintesiRichiesteAssistenzaQuery query)
        {
            this.logger.Log(this.GetType().Name + " - Inizio Reperimento Richieste di Assistenza");

            var richieste = this.cercaRichiesteAssistenza.Get(query.Filtro);
          
            List<RichiestaAssistenza> listaRichieste = new List<RichiestaAssistenza>();
            listaRichieste = query.ListaRichieste;

            #warning va realizzato il servizio di mapping delle richieste di assistenza sulla loro sintesi
            var sintesiRichiesta = new List<SintesiRichiesta>();
            sintesiRichiesta = ElencoSintesiRichiesta(query);
           
            this.logger.Log(this.GetType().Name + " - E' stata eseguita con successo");

            return new SintesiRichiesteAssistenzaResult()
            {
                SintesiRichiesta = sintesiRichiesta
            };
        }

        #region Interrogazione Fake da Session + Mapper della Richiesta sulla Sintesi

        public List<SintesiRichiesta> ElencoSintesiRichiesta(SintesiRichiesteAssistenzaQuery query)
        {
         
            List<RichiestaAssistenza> listaRichieste = new List<RichiestaAssistenza>();
            MapperListaRichieste mapper = new MapperListaRichieste();
            int CalcNumeroRecord = 0;
            int NumeroRecord = 0;

            listaRichieste = query.ListaRichieste; //this.cercaRichiesteAssistenza.Get(query.Filtro).ToList();

            CalcNumeroRecord = listaRichieste.Count - Convert.ToInt16(query.Filtro.SearchKey);

            if(CalcNumeroRecord < 15) { NumeroRecord = CalcNumeroRecord; }
            else { NumeroRecord = 15; }


            if (query.Filtro != null)
            {
                if (!query.Filtro.RichiestaSingola)
                {                          
                    this.logger.Log(this.GetType().Name + " - Mapper delle richieste eseguito");             
                    return mapper.MapRichiesteSuSintesi(listaRichieste).GetRange(Convert.ToInt16(query.Filtro.SearchKey), NumeroRecord).OrderBy(p => p.priorita).ToList();
                }
                else
                {         
                    this.logger.Log(this.GetType().Name + " - Mapper delle richieste eseguito");             
                    return mapper.MapRichiesteSuSintesi(listaRichieste).OrderBy(p => p.priorita).Where(p => Convert.ToInt16(p.id) == Convert.ToInt16(query.Filtro.SearchKey)).ToList();
                }
            }
            else
            {
                this.logger.Log(this.GetType().Name + " - Mapper delle richieste eseguito");             
                return mapper.MapRichiesteSuSintesi(listaRichieste).GetRange(Convert.ToInt16(query.Filtro.SearchKey), NumeroRecord).OrderBy(p => p.priorita).ToList();
            }
          
        }       
       

        private static List<RichiestaAssistenza> CercaRichieste(SintesiRichiesteAssistenzaQuery query)
        {

            //TODO PARTE CHIAMATA DB
 
            return  query.ListaRichieste; 

        }

        #endregion
    }
}

