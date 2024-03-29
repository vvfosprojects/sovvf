﻿//-----------------------------------------------------------------------
// <copyright file="GetAutorizzazioni.cs" company="CNVVF">
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
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class GetAutorizzazioni : IGetAutorizzazioni
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getListaUO;

        public GetAutorizzazioni(DbContext dbContext, IGetAlberaturaUnitaOperative getListaUO)
        {
            _dbContext = dbContext;
            _getListaUO = getListaUO;
        }

        /// <summary>
        ///   metodo della classe che recupera i ruoli appartenenti ad un utente
        /// </summary>
        /// <param name="id">Id dell'utente su mongo</param>
        /// <returns>L'utente</returns>

        public bool GetAutorizzazioniUtente(List<Role> ruoli, string codSedeDaVerificare, string ruoloNecessario)
        {
            var listaSediAlberate = _getListaUO.ListaSediAlberata();
            var listaPin = new List<PinNodo>();
            foreach (var ruolo in ruoli.FindAll(x => x.Descrizione.Equals(ruoloNecessario)))
            {
                if (ruolo.CodSede.ToLower().Equals("con"))
                    ruolo.CodSede = "00";

                listaPin.Add(new PinNodo(ruolo.CodSede, ruolo.Ricorsivo));
            }

            var listaSediDaVerificare = listaSediAlberate.Result?.GetSottoAlbero(listaPin).ToList().FindAll(s => listaPin.Any(x => x.Codice.Equals(s.Codice)));

            foreach (var unita in listaSediDaVerificare)
            {
                var ricorsivo = listaPin.FirstOrDefault(x => x.Codice.Equals(unita.Codice)).Ricorsivo;

                if (ricorsivo)
                {
                    if (unita?.Codice?.Equals(codSedeDaVerificare) ?? false)
                    {
                        return true;
                    }
                    else
                        if (unita.Figli != null)
                    {
                        if (unita.Figli.ToList().FindAll(x => x.Codice.Equals(codSedeDaVerificare)).Count > 0)
                            return true;

                        if (unita.Figli.ToList().FindAll(x => (bool)(x.Figli?.Any(c => c.Codice.Equals(codSedeDaVerificare)))).Count > 0)
                            return true;

                        if (unita.Figli.ToList().FindAll(x => (bool)(x.Figli?.Any(c => (bool)c.Figli?.Any(f => f.Codice.Equals(codSedeDaVerificare))))).Count > 0)
                            return true;
                    }
                }
            }
            return false;
        }
    }
}
