//-----------------------------------------------------------------------
// <copyright file="DeleteUtenteCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente
{
    /// <summary>
    ///   classe che gestisce la logica per la rimozione di un utente dalla base dati
    /// </summary>
    public class DeleteUtenteCommandHandler : ICommandHandler<DeleteUtenteCommand>
    {
        private readonly IDeleteUtente _deleteUtente;
        private readonly IDeleteRuolo _deleteRuolo;
        private readonly IGetAutorizzazioni _getAutorizzazioni;

        public DeleteUtenteCommandHandler(IDeleteUtente deleteUtente, IDeleteRuolo deleteRuolo, IGetAutorizzazioni getAutorizzazioni)
        {
            _deleteUtente = deleteUtente;
            _deleteRuolo = deleteRuolo;
            _getAutorizzazioni = getAutorizzazioni;
        }

        /// <summary>
        ///   metodo che si occupa della gestione dell'eliminazione
        /// </summary>
        /// <param name="command">i parametri di ingresso</param>
        public void Handle(DeleteUtenteCommand command)
        {
            //Se l'operatore è admin della sede dell'utente da cancellare, l'utente viene cancellato
            if(command.CheckSedeAdmin)
                _deleteUtente.Delete(command.CodFiscale);
            else
            {
                //Se l'utente da cancellare ha solo dei ruoli appartenenti alla sede dove l'operatore è admin, l'utente viene cancellato
                if(command.UtenteRimosso.Ruoli.Select(x=> x.CodSede).Distinct().Count() == 1)
                    _deleteUtente.Delete(command.CodFiscale);
                else
                {
                    //Altrimenti vengono cancellati solo i ruoli appartenenti alla sede dell'Admin
                    foreach (var ruoloUserDelete in command.UtenteRimosso.Ruoli)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(command.UtenteOperatore.Ruoli, ruoloUserDelete.CodSede, Costanti.Amministratore))
                            _deleteRuolo.Delete(command.CodFiscale, ruoloUserDelete);
                    }
                }
            }
        }
    }
}
