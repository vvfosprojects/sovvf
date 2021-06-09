﻿//-----------------------------------------------------------------------
// <copyright file="ComponenteSquadra.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Utenti;
using System;

namespace SO115App.API.Models.Classi.Condivise
{
    public class Componente
    {
        public Componente(string DescrizioneQualifica, string Nominativo, string Tooltip, bool CapoPartenza, bool Autista, bool Rimpiazzo)
        {
            this.DescrizioneQualifica = DescrizioneQualifica;
            this.Nominativo = Nominativo;
            //this.Tooltip = Tooltip;
            //this.CapoPartenza = CapoPartenza;
            //this.Autista = Autista;
            //this.Rimpiazzo = Rimpiazzo;
        }

        public Componente()
        {
        }

        /// <summary>
        ///   Descrizione codice fiscale Componente
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   Descrizione breve qualifica Componente
        /// </summary>
        public string DescrizioneQualifica { get; set; }

        /// <summary>
        ///   Descrizione lunga qualifica Componente
        /// </summary>
        //public string DescrizioneQualificaLunga { get; set; }

        /// <summary>
        ///   Ruolo ricoperto dall'operatore nel turno indicato
        /// </summary>
        public string Ruolo { get; set; }

        //public Turno CodiceTurno { get; set; }

        /// <summary>
        ///   Nominativo Componente
        /// </summary>
        public string Nominativo { get; set; }

        public DateTime OrarioInizio { get; set; }

        public DateTime OrarioFine { get; set; }

        /// <summary>
        ///   ToolTip Componente
        /// </summary>
        //public string Tooltip { get; set; }

        /// <summary>
        ///   Indica se il Componente è un capo Partenza
        /// </summary>
        public bool CapoPartenza => DescrizioneQualifica == "TEAM_LEADER";

        /// <summary>
        ///   Indica se è un autista
        /// </summary>
        public bool Autista => DescrizioneQualifica == "DRIVER";

        /// <summary>
        ///   Indica se il componente è un rimpiazzo
        /// </summary>
        public bool Rimpiazzo { get; set; }

        /// <summary>
        ///   Indica se il componente è un funzionario di guardia
        /// </summary>
        public bool FunGuardia { get; set; }

        /// <summary>
        ///   Indica se il componente è un tecnino di guardia 1
        /// </summary>
        public bool TecnicoGuardia1 { get; set; }

        /// <summary>
        ///   Indica se il componente è un tecnico di guardia 2
        /// </summary>
        public bool TecnicoGuardia2 { get; set; }

        /// <summary>
        ///   Indica se il componente è un capoturno
        /// </summary>
        public bool CapoTurno { get; set; }

        /// <summary>
        ///   descrive il numero di telefono del componente
        /// </summary>
        public string Telefono { get; set; }
    }
}
