//-----------------------------------------------------------------------
// <copyright file="GetPersonale.cs" company="CNVVF">
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

using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Box
{
    public class GetBoxPersonale : IGetBoxPersonale
    {
        private readonly IGetComposizioneSquadrePerBox _getComposizioneSquadre;

        public GetBoxPersonale(IGetComposizioneSquadrePerBox GetComposizioneSquadre)
        {
            _getComposizioneSquadre = GetComposizioneSquadre;
        }

        public BoxPersonale Get(string[] codiciSede)
        {
            var query = new ComposizioneSquadreQuery() 
            { 
                CodiciSede = codiciSede, 
                Filtro = new FiltriComposizioneSquadra()
                {
                    CodiciDistaccamenti = codiciSede
                }
            };

            var listaSquadreComposizione = _getComposizioneSquadre.Get(query)
                .GroupBy(s => s.Codice)
                .Select(s => s.First());

            var result = new BoxPersonale();

            result.SquadreAssegnate =
                listaSquadreComposizione.Count(x => x.Stato.Equals(StatoSquadraComposizione.InViaggio)) +
                listaSquadreComposizione.Count(x => x.Stato.Equals(StatoSquadraComposizione.InUscita)) +
                listaSquadreComposizione.Count(x => x.Stato.Equals(StatoSquadraComposizione.SulPosto)) +
                listaSquadreComposizione.Count(x => x.Stato.Equals(StatoSquadraComposizione.InRientro));

            result.SquadreServizio = listaSquadreComposizione.Count();

            result.PersonaleTotale = listaSquadreComposizione
                .SelectMany(s => s.Membri)
                .GroupBy(m => m.CodiceFiscale)
                .Select(m => m.First())
                .Count();

            result.Funzionari = listaSquadreComposizione.SelectMany(s => s.Membri).Where(m => m.CapoPartenza).Select(m => new Componente() 
            { 
                CodiceFiscale = m.CodiceFiscale,
                DescrizioneQualifica = m.DescrizioneQualifica,
                Nominativo = m.Nominativo,
                Ruolo = m.DescrizioneQualifica
            }).ToList();

            return result;
        }
    }
}
