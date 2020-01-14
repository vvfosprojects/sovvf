//-----------------------------------------------------------------------
// <copyright file="Mapper.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.FakePersistenceJSon.Classi;
using System;
using System.Collections.Generic;
using System.Linq;
using SO115App.Models.Classi.Utility;

namespace SO115App.FakePersistenceJSon.Utility
{
    public class MapperDTO
    {
        public static RichiestaAssistenza MapRichiestaDTOtoRichiesta(RichiestaAssistenzaDTO richiesta)
        {
            var richiestaMap = new RichiestaAssistenza()
            {
                Codice = richiesta.Cod,
                CodRichiesta = richiesta.CodRichiesta,
                CodSOCompetente = richiesta.CodSOCompetente,
                CodSOAllertate = richiesta.CodSOAllertate,
                CodUOCompetenza = richiesta.CodUOCompetenza,
                Competenze = richiesta.Competenze,
                Descrizione = richiesta.Descrizione,
                Localita = richiesta.Localita,
                CodOperatore = richiesta.CodOperatore,
                Richiedente = richiesta.Richiedente,
                Tags = richiesta.Tags,
                Tipologie = richiesta.Tipologie,
                CodZoneEmergenza = richiesta.CodZoneEmergenza,
                TrnInsChiamata = richiesta.TrnInsChiamata,
                TipoTerreno = richiesta.TipoTerreno,
                CodEntiIntervenuti = richiesta.CodEntiIntervenuti,
                ObiettivoSensibile = richiesta.ObiettivoSensibile,
                UtInLavorazione = richiesta.UtInLavorazione,
                UtPresaInCarico = richiesta.UtPresaInCarico,
                Id = richiesta.Id,
                NotePubbliche = richiesta.NotePubbliche,
                NotePrivate = richiesta.NotePrivate
            };

            if (richiesta.Eventi.Count > 0)
            {
                foreach (var evento in richiesta.Eventi)
                {
                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.Telefonata))
                    {
                        var tel = ((Newtonsoft.Json.Linq.JObject)evento).ToObject<Telefonata>();

                        new Telefonata(richiestaMap, richiesta.Cod, tel.Istante, richiesta.CodOperatore)
                        {
                            NominativoChiamante = tel.NominativoChiamante,
                            Motivazione = tel.Motivazione,
                            NotePrivate = tel.NotePrivate,
                            NotePubbliche = tel.NotePubbliche,
                            NumeroTelefono = tel.NumeroTelefono,
                            Esito = tel.Esito
                        };
                    }

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.InizioPresaInCarico))
                        new InizioPresaInCarico(richiestaMap, richiesta.IstantePresaInCarico.Value, richiesta.CodSOCompetente);

                    ///Gestione Partenza

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.Composizione))
                    {
                        var composizione = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<ComposizionePartenze>());
                        new ComposizionePartenze(richiestaMap, composizione.Istante, richiesta.CodSOCompetente, false)
                        {
                            Partenza = composizione.Partenza
                        };
                    }

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.ArrivoSulPosto))
                    {
                        var arrivoSulPosto = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<ArrivoSulPosto>());
                        new ArrivoSulPosto(richiestaMap, arrivoSulPosto.CodiceMezzo, arrivoSulPosto.Istante, richiesta.CodSOCompetente);
                    }

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.EventoMezzoInRientro))
                    {
                        var partenzaInRientro = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<PartenzaInRientro>());
                        new PartenzaInRientro(richiestaMap, partenzaInRientro.CodiceMezzo, partenzaInRientro.Istante, richiesta.CodSOCompetente);
                    }

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.EventoMezzoRientrato))
                    {
                        var partenzaRientrata = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<PartenzaRientrata>());
                        new PartenzaRientrata(richiestaMap, partenzaRientrata.CodiceMezzo, partenzaRientrata.Istante, richiesta.CodSOCompetente);
                    }

                    ///Gestione Stato Richiesta

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.ChiusuraRichiesta))
                    {
                        var chiusura = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<ChiusuraRichiesta>());
                        new ChiusuraRichiesta(chiusura.Motivazione, richiestaMap, chiusura.Istante, richiesta.CodSOCompetente);
                    }
                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.RiaperturaRichiesta))
                    {
                        var riapertura = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<RiaperturaRichiesta>());
                        new RiaperturaRichiesta(richiestaMap, riapertura.Istante, richiesta.CodSOCompetente);
                    }
                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.AssegnataRichiesta))
                    {
                        var assegnata = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<AssegnataRichiesta>());
                        new AssegnataRichiesta(richiestaMap, assegnata.Istante, richiesta.CodSOCompetente);
                    }
                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.EventoRichiestaPresidiata))
                    {
                        var presidiata = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<RichiestaPresidiata>());
                        new RichiestaPresidiata(richiestaMap, presidiata.Istante, richiesta.CodSOCompetente);
                    }
                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.EventoRichiestaSospesa))
                    {
                        var presidiata = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<RichiestaSospesa>());
                        new RichiestaSospesa(richiestaMap, presidiata.Istante, richiesta.CodSOCompetente);
                    }

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.AssegnataPriorita))
                    {
                        var assegnataPriorita = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<AssegnazionePriorita>());
                        new AssegnazionePriorita(richiestaMap, assegnataPriorita.Priorita, assegnataPriorita.Istante,
                            richiesta.CodSOCompetente);
                    }

                    if (((Newtonsoft.Json.Linq.JObject)evento).ToString().Contains(Costanti.MarcaRilevante))
                    {
                        var marcaRilevante = (((Newtonsoft.Json.Linq.JObject)evento).ToObject<MarcaRilevante>());
                        new MarcaRilevante(richiestaMap, marcaRilevante.Istante, richiesta.CodSOCompetente, "",
                            richiesta.RilevanteGrave, richiesta.RilevanteStArCu);
                    }
                }
            }

            return richiestaMap;
        }
    }
}
