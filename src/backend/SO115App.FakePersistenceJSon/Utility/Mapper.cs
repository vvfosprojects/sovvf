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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.FakePersistenceJSon.Classi;

namespace SO115App.FakePersistenceJSon.Utility
{
    public class MapperDTO
    {
        public static RichiestaAssistenza MapRichiestaDTOtoRichiesta(RichiestaAssistenzaDTO richiesta)
        {
            var richiestaMap = new RichiestaAssistenza()
            {
                Codice = richiesta.Codice,
                CodiceUnitaOperativaCompetente = richiesta.CodiceUnitaOperativaCompetente,
                CodiciUnitaOperativeAllertate = richiesta.CodiciUnitaOperativeAllertate,
                CodiciUOCompetenza = richiesta.CodiciUOCompetenza,
                Competenze = richiesta.Competenze,
                Descrizione = richiesta.Descrizione,
                Localita = richiesta.Localita,
                NumeroRichiedente = richiesta.NumeroRichiedente,
                Operatore = richiesta.Operatore,
                Richiedente = richiesta.Richiedente,
                Tags = richiesta.Tags,
                Tipologie = richiesta.Tipologie,
                ZoneEmergenza = richiesta.ZoneEmergenza,
                TurnoInserimentoChiamata = richiesta.TurnoInserimentoChiamata,
                TipoTerreno = richiesta.TipoTerreno,
                ListaEntiIntervenuti = richiesta.ListaEntiIntervenuti,
                CodiceObiettivoRilevante = richiesta.CodiceObiettivoRilevante
            };

            foreach (Evento evento in richiesta.Eventi)
            {
                richiestaMap.AddEvento(evento);
            }

            return richiestaMap;
        }
    }
}
