//-----------------------------------------------------------------------
// <copyright file="SetSchedaGestitaCommandHandler.cs" company="CNVVF">
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

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue
{
    public class MergeSchedeNueCommandHandler : ICommandHandler<MergeSchedeNueCommand>
    {
        private readonly IMergeSchedeContatto _mergeSchede;

        public MergeSchedeNueCommandHandler(IMergeSchedeContatto mergeSchede)
        {
            _mergeSchede = mergeSchede;
        }

        public void Handle(MergeSchedeNueCommand command)
        {
            _mergeSchede.Merge(command.SchedaNue, command.CodiceSede);
        }
    }
}
