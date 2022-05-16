﻿//-----------------------------------------------------------------------
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

        public DeleteBlockCommandHandler(IDeleteBlock deleteBlock,
                                       IGetAllBlocks getAllBlocks,
                                       IGetSintesiRichiestaAssistenzaByCodice getSintesiById)
        {
            _deleteBlock = deleteBlock;
            _getAllBlocks = getAllBlocks;
            _getSintesiById = getSintesiById;
        }

        public void Handle(DeleteBlockCommand command)
        {
            try
            {
                var sediDaAllertare = new List<string>();
                var listaBlocchiSede = _getAllBlocks.GetAll(new string[] { command.CodiceSede });
                var blocchiInteressati = listaBlocchiSede.FindAll(c => !c.Type.Equals(TipoOperazione.Mezzo) && !c.Type.Equals(TipoOperazione.Squadra));

                if (blocchiInteressati.Count > 0)
                {
                    command.listaSediDaAllertare = _getSintesiById.GetSintesi(blocchiInteressati.FindAll(c => !c.Type.Equals(TipoOperazione.Mezzo) && !c.Type.Equals(TipoOperazione.Squadra) && !c.Type.Equals(TipoOperazione.CambioStatoPartenza))[0].Value).CodSOAllertate.ToList();
                }

                foreach (var id in command.ListaIdConcorrenza)
                {
                    _deleteBlock.Delete(id);
                }
            }
            catch (Exception ex)
            {
            }
        }
    }
}
