//-----------------------------------------------------------------------
// <copyright file="SezioneOperativa.cs" company="CNVVF">
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
namespace SO115App.API.Models.Classi.Soccorso.Squadre
{
    /// <summary>
    ///   Modella la sezione operativa (ex colonna mobile)
    /// </summary>
    /// <remarks>
    ///   La composizione della sezione operativa è sistematica e predispone delle squadre allo scopo
    ///   di far fronte con tempestività ad emergenze non ancora manifestatesi. In questo senso si
    ///   può considerare assimilabile ad un turno di reperibilità. I turni di sezione operativa si
    ///   sovrappongono con le normali turnazioni del soccorso ordinario e delle altre attività pianificate.
    /// </remarks>
    public class SezioneOperativa : DisponibilitaSquadra
    {
    }
}
