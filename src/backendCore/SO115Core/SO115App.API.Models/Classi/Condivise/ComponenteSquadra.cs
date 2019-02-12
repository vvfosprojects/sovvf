//-----------------------------------------------------------------------
// <copyright file="NonNecessario.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Condivise
{
    public class Componente
    {

        public Componente(string DescrizioneQualifica, string Nominativo, string Tooltip, bool CapoPartenza, bool Autista, bool Rimpiazzo)
        {
            this.descrizioneQualifica = DescrizioneQualifica;
            this.nominativo = Nominativo;
            this.tooltip = Tooltip;
            this.capoPartenza = CapoPartenza;
            this.autista = Autista;
            this.rimpiazzo = Rimpiazzo;

        }


        /// <summary>
        ///   Descrizione qualifica Componente
        /// </summary>
        public string descrizioneQualifica { get; set; }

        /// <summary>
        ///   Nominativo Componente
        /// </summary>
        public string nominativo { get; set; }

        /// <summary>
        ///   ToolTip Componente
        /// </summary>
        public string tooltip { get; set; }

        /// <summary>
        ///   Indica se il Componente è un capo Partenza 
        /// </summary>
        public bool capoPartenza { get; set; }

        /// <summary>
        ///   Indica se è un autista
        /// </summary>
        public bool autista { get; set; }

        /// <summary>
        ///   Indica se il componente è un rimpiazzo
        /// </summary>
        public bool rimpiazzo { get; set; }

    }
}
