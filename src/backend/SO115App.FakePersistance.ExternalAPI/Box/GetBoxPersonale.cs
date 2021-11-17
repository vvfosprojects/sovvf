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
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Box
{
    public class GetBoxPersonale : IGetBoxPersonale
    {
        private readonly IGetStatoSquadra _getStatoSquadra;
        private readonly IGetSquadre _getSquadre;
        private readonly IGetSedi _sedi;

        public GetBoxPersonale(IGetStatoSquadra getStatoSquadra, IGetSquadre getSquadre, IGetSedi sedi)
        {
            _getStatoSquadra = getStatoSquadra;
            _getSquadre = getSquadre;
            _sedi = sedi;
        }

        public BoxPersonale Get(string[] codiciSede)
        {
            if(codiciSede.Any(s => s == "00" || s == "001"))
            {
                codiciSede = _sedi.GetAll().Result.Select(s => s.Codice).ToArray();
            }

            var statoSquadre = _getStatoSquadra.Get(codiciSede.ToList());

            var lstCodici = codiciSede.Select(cod => cod.Split('.')[0]).Distinct();

            var workshift = new List<WorkShift>();

            Parallel.ForEach(lstCodici, codice => workshift.Add(_getSquadre.GetAllByCodiceDistaccamento(codice).Result));

            workshift.RemoveAll(w => w == null);

            var box = workshift.SelectMany(w => w.Squadre).Where(s => codiciSede.Contains(s.Distaccamento)).ToList();

            var result = new BoxPersonale
            {
                Funzionari = new ConteggioFunzionari
                {
                    Current = workshift.SelectMany(w => w.Attuale?.Funzionari?.Select(m => new Componente
                    {
                        CodiceFiscale = m.CodiceFiscale,
                        DescrizioneQualifica = m.Ruolo,
                        Nominativo = $"{m.Nome} {m.Cognome}",
                        Ruolo = m.Ruolo
                    }))?.ToList(),
                    Next = workshift.SelectMany(w => w.Successivo?.Funzionari?.Select(m => new Componente
                    {
                        CodiceFiscale = m.CodiceFiscale,
                        DescrizioneQualifica = m.Ruolo,
                        Nominativo = $"{m.Nome} {m.Cognome}",
                        Ruolo = m.Ruolo
                    }))?.ToList(),
                    Previous = workshift.SelectMany(w => w.Precedente?.Funzionari?.Select(m => new Componente
                    {
                        CodiceFiscale = m.CodiceFiscale,
                        DescrizioneQualifica = m.Ruolo,
                        Nominativo = $"{m.Nome} {m.Cognome}",
                        Ruolo = m.Ruolo
                    }))?.ToList()
                },
                PersonaleTotale = new ConteggioPersonale
                {
                    Current = workshift.Select(w => w.Attuale?.Squadre.SelectMany(s => s.Membri).GroupBy(m => m.CodiceFiscale).Select(m => m.First())).Count(),
                    Next = workshift.Select(w => w.Successivo?.Squadre.SelectMany(s => s.Membri).GroupBy(m => m.CodiceFiscale).Select(m => m.First())).Count(),
                    Previous = workshift.Select(w => w.Precedente?.Squadre.SelectMany(s => s.Membri).GroupBy(m => m.CodiceFiscale).Select(m => m.First())).Count(),
                },
                SquadreServizio = new ConteggioPersonale
                {
                    Current = workshift.SelectMany(w => w?.Attuale?.Squadre).Count(),
                    Next = workshift.SelectMany(w => w?.Successivo?.Squadre).Count(),
                    Previous = workshift.SelectMany(w => w?.Precedente?.Squadre).Count()
                },
                SquadreAssegnate = statoSquadre.Count
            };

            return result;
        }
    }
}
