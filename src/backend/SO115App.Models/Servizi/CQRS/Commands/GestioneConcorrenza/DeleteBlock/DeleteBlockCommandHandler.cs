//-----------------------------------------------------------------------
// <copyright file="MezzoPrenotatoQueryHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteBlock
{
    public class DeleteBlockCommandHandler : ICommandHandler<DeleteBlockCommand>
    {
        private readonly IDeleteBlock _deleteBlock;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;
        private readonly IGetSediConcorrenza _getSediConcorrenza;
        private readonly IGetBlockByValue _getBlock;

        public DeleteBlockCommandHandler(IDeleteBlock deleteBlock,
                                       IGetAllBlocks getAllBlocks,
                                       IGetSintesiRichiestaAssistenzaByCodice getSintesiById,
                                       IGetSediConcorrenza getSediConcorrenza,
                                       IGetBlockByValue getBlock)
        {
            _deleteBlock = deleteBlock;
            _getAllBlocks = getAllBlocks;
            _getSintesiById = getSintesiById;
            _getSediConcorrenza = getSediConcorrenza;
            _getBlock = getBlock;
        }

        public void Handle(DeleteBlockCommand command)
        {
            try
            {
                var lstConcorrenza = new List<Concorrenza>();

                foreach (var id in command.ListaIdConcorrenza)
                {
                    lstConcorrenza.Add(_getBlock.GetById(id));

                    _deleteBlock.Delete(id);
                }

                command.ListaConcorrenza = lstConcorrenza;

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}