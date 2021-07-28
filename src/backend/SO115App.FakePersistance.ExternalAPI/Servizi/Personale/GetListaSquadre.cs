//-----------------------------------------------------------------------
// <copyright file="GetListaSquadre.cs" company="CNVVF">
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
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetListaSquadre : IGetListaSquadre
    {
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPersonaleByCF _getPersonaleByCF;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetListaSquadre(
             IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
             IGetPersonaleByCF GetPersonaleByCF,
             IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPersonaleByCF = GetPersonaleByCF;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public async Task<IEnumerable<Squadra>> Get(List<string> sedi)
        {
            var pinNodi = sedi.Select(s => new PinNodo(s, true));
            var ListaCodiciSedi = new List<string>();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                var codice = figlio.Codice;
                string codiceE = "";
                codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    ListaCodiciSedi.Add(codice);
                }
            }

            string json;
            using (var r = new StreamReader(Costanti.ListaSquadre))
            {
                json = r.ReadToEnd();
            }

            var listaSquadreJson = JsonConvert.DeserializeObject<IEnumerable<SquadraFake>>(json)
                .Where(s => ListaCodiciSedi.Contains(s.Sede));

            var lstcodicifiscali = listaSquadreJson
                .SelectMany(c => c.ComponentiSquadra)
                .Select(c => c.CodiceFiscale)
                .Distinct()
                .ToArray();

            var lstVVF = _getPersonaleByCF.Get(lstcodicifiscali, sedi.ToArray());

            //MAPPING
            var result = new ConcurrentQueue<Squadra>();

            Parallel.ForEach(listaSquadreJson, squadraFake => result.Enqueue(MapSqaudra(squadraFake, lstVVF.Result)));

            return result;
        }

        private Squadra MapSqaudra(SquadraFake squadraFake, IEnumerable<PersonaleVVF> lstVVF)
        {
            var distaccamento = _getDistaccamentoByCodiceSedeUC.Get(squadraFake.Sede);

            var ListaCodiciFiscaliComponentiSquadra = new ConcurrentQueue<string>();
            var ComponentiSquadra = new ConcurrentQueue<Componente>();

            Parallel.ForEach(squadraFake.ComponentiSquadra, componenteFake =>
            {
                var pVVf = lstVVF.FirstOrDefault(p => p.codiceFiscale.Equals(componenteFake.CodiceFiscale));

                if (pVVf != null)
                {
                    var componente = new Componente(componenteFake.DescrizioneQualificaLunga,
                    pVVf.nome, componenteFake.Tooltip, componenteFake.CapoPartenza, componenteFake.Autista, componenteFake.Rimpiazzo)
                    {
                        CodiceFiscale = pVVf.codiceFiscale,
                        OrarioFine = componenteFake.OrarioFine,
                        OrarioInizio = componenteFake.OrarioInizio,
                    };

                    ComponentiSquadra.Enqueue(componente);
                    ListaCodiciFiscaliComponentiSquadra.Enqueue(pVVf.codiceFiscale);
                }
            });

            Squadra.StatoSquadra Stato;

            switch (squadraFake.Stato)
            {
                case "L": Stato = Squadra.StatoSquadra.InSede; break;
                case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
                case "R": Stato = Squadra.StatoSquadra.InRientro; break;
                default: Stato = Squadra.StatoSquadra.InSede; break;
            }

            var sedeDistaccamento = new Sede(squadraFake.Sede, distaccamento.Result?.DescDistaccamento, distaccamento.Result?.Indirizzo, distaccamento.Result?.Coordinate, "", "", "", "", "");

            var s = new Squadra(squadraFake.NomeSquadra, Stato, ComponentiSquadra.ToList(), sedeDistaccamento, squadraFake.Turno);

            s.Id = squadraFake.CodiceSquadra;
            s.Codice = squadraFake.CodiceSquadra;
            //s.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra.ToList();

            return s;
        }
    }
}
