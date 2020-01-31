//-----------------------------------------------------------------------
// <copyright file="UndoMergeSchedeNueCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.UndoMergeSchedeNue
{
    /// <summary>
    ///   servizio che elimina le schede raggruppate
    /// </summary>
    internal class UndoMergeSchedeNueCommandHandler : ICommandHandler<UndoMergeSchedeNueCommand>
    {
        private readonly IUndoSchedeContattoMerge _undoSchedeContattoMerge;

        public UndoMergeSchedeNueCommandHandler(IUndoSchedeContattoMerge undoSchedeContattoMerge)
        {
            _undoSchedeContattoMerge = undoSchedeContattoMerge;
        }

        /// <summary>
        ///   metodo della classe che elimina le schede passate in input dalla collection relativa.
        /// </summary>
        /// <param name="command">il commando di ingresso</param>
        public void Handle(UndoMergeSchedeNueCommand command)
        {
            _undoSchedeContattoMerge.Undo(command.SchedaNue);
        }
    }
}
