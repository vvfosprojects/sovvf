//-----------------------------------------------------------------------
// <copyright file="MapperListaRichiesteSuListaSintesiRichieste.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.Linq;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi
{
    internal class MapperListaRichieste
    {
        public List<SintesiRichiesta> MapRichiesteSuSintesi(List<RichiestaAssistenza> ListaRichieste)
        {
            List<SintesiRichiesta> ListaSintesi = new List<SintesiRichiesta>();
            List<SintesiRichiesta> AppoListaSintesiChiamate = new List<SintesiRichiesta>();
            List<SintesiRichiesta> AppoListaSintesiAltroStato = new List<SintesiRichiesta>();

            foreach (RichiestaAssistenza elemento in ListaRichieste)
            {
                SintesiRichiesta sintesi = new SintesiRichiesta();
                string statoRichiesta = DecodifcaStatoRichiesta(elemento.StatoRichiesta);
                var utente =

                sintesi.Codice = elemento.Codice;
                sintesi.CodiceSchedaNue = elemento.CodNue;
                sintesi.Competenze = elemento.Competenze;
                //sintesi.complessita = elemento.Richiesta.Complessita;
                sintesi.Descrizione = elemento.Descrizione;
                sintesi.Tags = elemento.Tags;
                sintesi.Eventi = elemento.Eventi.ToList();
                //sintesi.fonogramma = elemento.Richiesta.StatoInvioFonogramma;
                sintesi.Id = elemento.Id;
                sintesi.IstantePresaInCarico = elemento.IstantePresaInCarico;
                sintesi.IstantePrimaAssegnazione = elemento.IstantePrimaAssegnazione;

                sintesi.IstanteRicezioneRichiesta = sintesi.Eventi.Count > 0 ? elemento.IstanteRicezioneRichiesta.Value : DateTime.MinValue;
                sintesi.Localita = elemento.Localita;
                //sintesi.Operatore = elemento.Operatore;
                sintesi.Richiedente = elemento.Richiedente;
                //sintesi.Stato = statoRichiesta;
                sintesi.Tipologie = new List<Tipologia>(); //TODO getTipologiaByID
                sintesi.ZoneEmergenza = elemento.CodZoneEmergenza;

                if (statoRichiesta.Equals("Chiamata"))
                    AppoListaSintesiChiamate.Add(sintesi);
                else
                    AppoListaSintesiAltroStato.Add(sintesi);
            }

            //INIZIO - TUTTA QUESTA PARTE VA CANCELLATA DOPO IL FAKE
            foreach (SintesiRichiesta richiesta in AppoListaSintesiChiamate)
            {
                if (richiesta.Partenze.Count > 0)
                {
                    richiesta.Partenze.Clear();
                }
            }

            ListaSintesi.AddRange(AppoListaSintesiChiamate);
            ListaSintesi.AddRange(AppoListaSintesiAltroStato);
            //FINE

            return ListaSintesi;
        }

        private string DecodifcaStatoRichiesta(IStatoRichiesta statoRichiesta)
        {
            switch (statoRichiesta.ToString())
            {
                case "Modello.Classi.Soccorso.StatiRichiesta.InAttesa":
                    return "Chiamata";

                case "Modello.Classi.Soccorso.StatiRichiesta.Assegnata":
                    return "Assegnata";

                case "Modello.Classi.Soccorso.StatiRichiesta.Chiusa":
                    return "Chiusa";

                case "Modello.Classi.Soccorso.StatiRichiesta.Sospesa":
                    return "Sospesa";

                default:
                    return "Chiusa";
            }
        }
    }
}
