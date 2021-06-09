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
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            var numeroComponenti = 0;

            var listaSquadreComposizione = new ConcurrentQueue<ComposizioneSquadre>();

            Parallel.ForEach(codiciSede, Codsede =>
            {
                var query = new ComposizioneSquadreQuery() { CodiciSede = new string[] { Codsede } };

                _getComposizioneSquadre.Get(query).ForEach(cs => listaSquadreComposizione.Enqueue(cs));
            });

            var result = new BoxPersonale();

            result.SquadreAssegnate =
                listaSquadreComposizione.Count(x => x.Squadra.Stato == Squadra.StatoSquadra.InViaggio) +
                listaSquadreComposizione.Count(x => x.Squadra.Stato == Squadra.StatoSquadra.InUscita) +
                listaSquadreComposizione.Count(x => x.Squadra.Stato == Squadra.StatoSquadra.SulPosto) +
                listaSquadreComposizione.Count(x => x.Squadra.Stato == Squadra.StatoSquadra.InRientro);
            result.SquadreServizio =
                listaSquadreComposizione.Count;

            var listaFunzionari = new ConcurrentQueue<Componente>();

            foreach (var partenza in listaSquadreComposizione)
            {
                numeroComponenti += partenza.Squadra.Componenti.Count;
                foreach (var componente in partenza.Squadra.Componenti)
                {
                    if (componente.TecnicoGuardia1 || componente.TecnicoGuardia2 || componente.CapoTurno ||
                        componente.FunGuardia)
                    {
                        listaFunzionari.Enqueue(componente);
                    }
                }
            }

            result.PersonaleTotale = numeroComponenti;
            result.Funzionari = listaFunzionari.ToList();

            return result;
        }
    }
}
