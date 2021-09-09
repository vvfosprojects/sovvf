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
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Box
{
    public class GetBoxPersonale : IGetBoxPersonale
    {
        private readonly IGetComposizioneSquadrePerBox _getComposizioneSquadre;
        private readonly IGetSquadre _getSquadre;

        public GetBoxPersonale(IGetComposizioneSquadrePerBox GetComposizioneSquadre, IGetSquadre getSquadre)
        {
            _getComposizioneSquadre = GetComposizioneSquadre;
            _getSquadre = getSquadre;
        }

        public BoxPersonale Get(string[] codiciSede)
        {
            var filtroTurno = new ComposizioneSquadreQuery() 
            { 
                CodiciSede = codiciSede, 
                Filtro = new FiltriComposizioneSquadra()
                {
                    CodiciDistaccamenti = codiciSede,
                    Turno = Models.Classi.Condivise.TurnoRelativo.Attuale
                }
            };

            var filtro = new ComposizioneSquadreQuery()
            {
                CodiciSede = codiciSede,
                Filtro = new FiltriComposizioneSquadra()
                {
                    CodiciDistaccamenti = codiciSede,
                    Turno = null
                }
            };

            var listaSquadreComposizione = _getComposizioneSquadre.Get(filtroTurno)
                .GroupBy(s => s.Codice)
                .Select(s => s.First());

            Task<WorkShift> workshift = null; // TODO TUTTI E SUDDIVISI (PREV CURR E NEXT)

            Parallel.ForEach(filtro.CodiciSede.Select(cod => cod.Split('.')[0]).Distinct(), codice => workshift = _getSquadre.GetAllByCodiceDistaccamento(codice));

            var result = new BoxPersonale();

            result.Funzionari = new Funzionari()
            {
                Current = workshift.Result.Attuale.Funzionari.Select(m => new Componente()
                {
                    CodiceFiscale = m.CodiceFiscale,
                    DescrizioneQualifica = m.Ruolo,
                    Nominativo = $"{m.Nome} {m.Cognome}",
                    Ruolo = m.Ruolo
                }).ToList(),
                Next = workshift.Result.Successivo.Funzionari.Select(m => new Componente()
                {
                    CodiceFiscale = m.CodiceFiscale,
                    DescrizioneQualifica = m.Ruolo,
                    Nominativo = $"{m.Nome} {m.Cognome}",
                    Ruolo = m.Ruolo
                }).ToList(),
                Previous = workshift.Result.Precedente.Funzionari.Select(m => new Componente()
                {
                    CodiceFiscale = m.CodiceFiscale,
                    DescrizioneQualifica = m.Ruolo,
                    Nominativo = $"{m.Nome} {m.Cognome}",
                    Ruolo = m.Ruolo
                }).ToList()
            };

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

            return result;
        }
    }
}
