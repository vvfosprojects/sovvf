//-----------------------------------------------------------------------
// <copyright file="SituazioneMezzo.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Classi.Soccorso.Mezzi.SituazioneMezzo
{
    /// <summary>
    ///   Contiene la situazione di un mezzo di soccorso, cioè lo stato in cui si trova
    /// </summary>
    public class SituazioneMezzo
    {
        /// <summary>
        ///   Il codice del mezzo
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   La descrizione del mezzo
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   La targa del mezzo
        /// </summary>
        public string Targa { get; set; }

        /// <summary>
        ///   La descrizione dell'unità operativa a cui è associato il mezzo
        /// </summary>
        public string DescrizioneUnitaOperativa { get; set; }

        /// <summary>
        ///   Il codice dello stato in cui si trova il mezzo
        /// </summary>
        public string CodiceStato { get; set; }

        /// <summary>
        ///   L'istante in cui è avvenuto l'aggiornamento dello stato del mezzo, contenuto nella
        ///   proprietà <see cref="CodiceStato" />
        /// </summary>
        public DateTime IstanteAggiornamentoStato { get; set; }

        /// <summary>
        ///   Il codice della richiesta di assistenza alla quale il mezzo è associato
        /// </summary>
        public string CodiceRichiestaAssistenza { get; set; }

        /// <summary>
        ///   Indica se il mezzo è disponibile
        /// </summary>
        public bool Disponibile { get; set; }

        /// <summary>
        ///   La descrizione della squadra impegnata sul mezzo
        /// </summary>
        public string DescrizioneSquadra { get; set; }

        /// <summary>
        ///   Il tooltip che appare sulla descrizione della squadra
        /// </summary>
        public string TooltipSquadra { get; set; }

        /// <summary>
        ///   Le persone a bordo del mezzo
        /// </summary>
        public PersonaSulMezzo[] PersoneSulMezzo { get; set; }
    }
}
