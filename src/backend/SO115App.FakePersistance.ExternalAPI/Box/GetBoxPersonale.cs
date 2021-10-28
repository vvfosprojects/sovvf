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
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
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
        private readonly IGetStatoSquadra _getStatoSquadra;
        private readonly IGetSquadre _getSquadre;

        public GetBoxPersonale(IGetStatoSquadra getStatoSquadra, IGetSquadre getSquadre)
        {
            _getStatoSquadra = getStatoSquadra;
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

            Task<WorkShift> workshift = null;

            Parallel.ForEach(filtro.CodiciSede.Select(cod => cod.Split('.')[0]).Distinct(), codice => workshift = _getSquadre.GetAllByCodiceDistaccamento(codice));

            var statoSquadre = _getStatoSquadra.Get(codiciSede.ToList());

            var result = new BoxPersonale();

            result.Funzionari = new ConteggioFunzionari()
            {
                Current = workshift.Result.Attuale?.Funzionari.Select(m => new Componente()
                {
                    CodiceFiscale = m.CodiceFiscale,
                    DescrizioneQualifica = m.Ruolo,
                    Nominativo = $"{m.Nome} {m.Cognome}",
                    Ruolo = m.Ruolo
                }).ToList(),
                Next = workshift.Result.Successivo?.Funzionari.Select(m => new Componente()
                {
                    CodiceFiscale = m.CodiceFiscale,
                    DescrizioneQualifica = m.Ruolo,
                    Nominativo = $"{m.Nome} {m.Cognome}",
                    Ruolo = m.Ruolo
                }).ToList(),
                Previous = workshift.Result.Precedente?.Funzionari.Select(m => new Componente()
                {
                    CodiceFiscale = m.CodiceFiscale,
                    DescrizioneQualifica = m.Ruolo,
                    Nominativo = $"{m.Nome} {m.Cognome}",
                    Ruolo = m.Ruolo
                }).ToList()
            };

            var statiAssegnati = new string[] { Costanti.MezzoInUscita, Costanti.MezzoSulPosto, Costanti.MezzoInViaggio, Costanti.MezzoInRientro };

            result.SquadreAssegnate = statoSquadre.Count;

            result.SquadreServizio = new ConteggioPersonale()
            {
                Current = workshift.Result.Attuale?.Squadre.Count() ?? 0,
                Next = workshift.Result.Successivo?.Squadre.Count() ?? 0,
                Previous = workshift.Result.Precedente?.Squadre.Count() ?? 0,
            };

            result.PersonaleTotale = new ConteggioPersonale()
            {
                Current = workshift.Result.Attuale?.Squadre.SelectMany(s => s.Membri).GroupBy(m => m.CodiceFiscale).Select(m => m.First()).Count() ?? 0,
                Next = workshift.Result.Successivo?.Squadre.SelectMany(s => s.Membri).GroupBy(m => m.CodiceFiscale).Select(m => m.First()).Count() ?? 0,
                Previous = workshift.Result.Precedente?.Squadre.SelectMany(s => s.Membri).GroupBy(m => m.CodiceFiscale).Select(m => m.First()).Count() ?? 0,
            };

            return result;
        }
    }
}
