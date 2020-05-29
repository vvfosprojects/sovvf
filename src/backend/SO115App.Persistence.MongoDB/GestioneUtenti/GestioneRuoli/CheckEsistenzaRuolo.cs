//-----------------------------------------------------------------------
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
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class CheckEsistenzaRuolo : ICheckEsistenzaRuolo
    {
        private readonly IGetAlberaturaUnitaOperative _getListaUO;
        private readonly IGetUtenteByCF _getUtenteByCF;

        public CheckEsistenzaRuolo(IGetAlberaturaUnitaOperative getListaUO, IGetUtenteByCF getUtenteByCF)
        {
            _getListaUO = getListaUO;
            _getUtenteByCF = getUtenteByCF;
        }

        public bool Check(List<Role> ruoliDaAggiungere, string codiceFiscaleUtenteDaControllare)
        {
            var utente = _getUtenteByCF.Get(codiceFiscaleUtenteDaControllare);

            if (utente != null)
            {
                var listaSediAlberate = _getListaUO.ListaSediAlberata();

                List<Role> listaRuoliEsplosaPerRicorsivita = new List<Role>();

                foreach (var ruolo in utente.Ruoli)
                {
                    var listaPin = new List<PinNodo>();
                    PinNodo pin = new PinNodo(ruolo.CodSede, ruolo.Ricorsivo);
                    listaPin.Add(pin);
                    foreach (var unita in listaSediAlberate.GetSottoAlbero(listaPin))
                    {
                        Role ruoloEsploso = new Role(ruolo.Descrizione, unita.Codice);
                        listaRuoliEsplosaPerRicorsivita.Add(ruoloEsploso);
                    }
                }

                var risultato = listaRuoliEsplosaPerRicorsivita.Where(o => ruoliDaAggiungere.Any(s => o.CodSede.Equals(s.CodSede) && o.Descrizione.Equals(s.Descrizione))).ToList();

                if (risultato.Count > 0)
                    return false;
                else
                    return true;
            }
            else
                return true;
        }
    }
}
