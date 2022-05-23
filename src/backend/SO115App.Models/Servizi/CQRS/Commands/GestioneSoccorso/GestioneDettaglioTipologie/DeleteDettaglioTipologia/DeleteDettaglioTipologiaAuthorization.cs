﻿using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia
{
    public class DeleteDettaglioTipologiaAuthorization : ICommandAuthorizer<DeleteDettaglioTipologiaCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;

        public DeleteDettaglioTipologiaAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetSottoSediByCodSede getSottoSediByCodSede,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
        }

        public IEnumerable<AuthorizationResult> Authorize(DeleteDettaglioTipologiaCommand command)
        {
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    #region Concorrenza

                    //Controllo Concorrenza
                    var listaSediInteressate = _getSottoSediByCodSede.Get(command.CodiceSede);

                    if (!_isActionFree.Check(TipoOperazione.EliminaDettaglioTipologia, user.Id, listaSediInteressate.ToArray(), command.CodDettaglioTipologia.ToString()))
                        yield return new AuthorizationResult(Costanti.InterventoOccupato);

                    #endregion Concorrenza

                    Boolean abilitato = false;
                    foreach (var ruolo in user.Ruoli)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiceSede[0], Costanti.GestoreChiamate))
                            abilitato = true;
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiceSede[0], Costanti.GestoreRichieste))
                            abilitato = true;
                    }

                    if (!abilitato)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
