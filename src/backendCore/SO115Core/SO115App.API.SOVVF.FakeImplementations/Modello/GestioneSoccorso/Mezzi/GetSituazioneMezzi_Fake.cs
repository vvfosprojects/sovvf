//-----------------------------------------------------------------------
// <copyright file="GetSituazioneMezzi_Fake.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso.Mezzi.SituazioneMezzo;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using System;
using System.Collections.Generic;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi
{
    /// <summary>
    ///   Servizio fake che restituisce la situazione dei mezzi in servizio
    /// </summary>
    public class GetSituazioneMezzi_Fake : IGetSituazioneMezzi
    {
        /// <summary>
        ///   Restituisce una situazione dei mezzi fake
        /// </summary>
        /// <param name="codiciUnitaOperative">Not used</param>
        /// <returns>La situazione dei mezzi</returns>
        public IEnumerable<SituazioneMezzo> Get(ISet<PinNodo> codiciUnitaOperative)
        {
            var rnd = new Random();
            return new SituazioneMezzo[]
                {
                    new SituazioneMezzo()
                    {
                        Codice = "CODICEMEZZO1",
                        CodiceRichiestaAssistenza = "123.456.789",
                        CodiceStato = "InViaggio",
                        Descrizione = "APS/11",
                        Targa = "12345",
                        DescrizioneSquadra = "Squadra1",
                        DescrizioneUnitaOperativa = "Centrale",
                        Disponibile = true,
                        IstanteAggiornamentoStato = DateTime.Now.AddMinutes(-5),
                        TooltipSquadra = "A 12/06/17",
                        PersoneSulMezzo = new PersonaSulMezzo[]
                        {
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "AAABBB65T74Y777R",
                                Descrizione = "Michele Giorgi",
                                Tooltip = "AAABBB65T74Y777R",
                                CapoPartenza = true,
                                Autista = false,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "XXXPPP67T54T777R",
                                Descrizione = "Antonio Carli",
                                Tooltip = "XXXPPP67T54T777R",
                                CapoPartenza = false,
                                Autista = true,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "LLLKKK65T34R454T",
                                Descrizione = "Antonio Miceli",
                                Tooltip = "LLLKKK65T34R454T",
                                CapoPartenza = false,
                                Autista = false,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "OOOTTT65R45E232W",
                                Descrizione = "Gennaro Vitale",
                                Tooltip = "OOOTTT65R45E232W",
                                CapoPartenza = false,
                                Autista = false,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "CVCSFS43R23W232K",
                                Descrizione = "Samantha Grossi",
                                Tooltip = "CVCSFS43R23W232K",
                                CapoPartenza = false,
                                Autista = false,
                                Rimpiazzo = true
                            }
                        }
                    },
                    new SituazioneMezzo()
                    {
                        Codice = "CODICEMEZZO2",
                        CodiceRichiestaAssistenza = "987.654.321",
                        CodiceStato = "InSede",
                        Descrizione = "APS/10",
                        Targa = "44444",
                        DescrizioneSquadra = "Squadra2",
                        DescrizioneUnitaOperativa = "Tuscolano",
                        Disponibile = true,
                        IstanteAggiornamentoStato = DateTime.Now.AddMinutes(-15),
                        TooltipSquadra = "A 12/06/17",
                        PersoneSulMezzo = new PersonaSulMezzo[]
                        {
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "AAABBB65T74Y777R",
                                Descrizione = "Gioacchino Verdi",
                                Tooltip = "AAABBB65T74Y777R",
                                CapoPartenza = true,
                                Autista = false,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "XXXPPP67T54T777R",
                                Descrizione = "Giacomo Puccini",
                                Tooltip = "XXXPPP67T54T777R",
                                CapoPartenza = false,
                                Autista = true,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "LLLKKK65T34R454T",
                                Descrizione = "Giovanni Pascoli",
                                Tooltip = "LLLKKK65T34R454T",
                                CapoPartenza = false,
                                Autista = false,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "OOOTTT65R45E232W",
                                Descrizione = "Ludovico Van Beethoven",
                                Tooltip = "OOOTTT65R45E232W",
                                CapoPartenza = false,
                                Autista = false,
                                Rimpiazzo = false
                            },
                            new PersonaSulMezzo()
                            {
                                CodiceFiscale = "CVCSFS43R23W232K",
                                Descrizione = "Wolfgang Amadeus Mozart",
                                Tooltip = "CVCSFS43R23W232K",
                                CapoPartenza = false,
                                Autista = false,
                                Rimpiazzo = true
                            }
                        }
                    }
            };
        }
    }
}