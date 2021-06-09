//-----------------------------------------------------------------------
// <copyright file="GetComposizioneSquadre.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetAnagraficaComponente _getAnagrafica;
        private readonly IGetMezziUtilizzabili _getMezzi;
        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        public GetComposizioneSquadre(IGetSquadre getSquadre, IGetStatoSquadra getStatoSquadre, IGetMezziUtilizzabili getMezzi, IGetAnagraficaComponente getAnagrafica)
        {
            _getMezzi = getMezzi;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _getAnagrafica = getAnagrafica;
        }

        public List<ComposizioneSquadra> Get(ComposizioneSquadreQuery query)
        {
            var lstStatiSquadre = Task.Run(() => _getStatoSquadre.Get(query.CodiciSede.ToList()));
            
            var lstSquadreComposizione = Task.Run(() => //OTTENGO I DATI
            {
                var lstSquadre = new ConcurrentBag<SO115App.Models.Classi.ServiziEsterni.OPService.Squadra>();

                Parallel.ForEach(query.CodiciSede, codice => _getSquadre.GetByCodiceDistaccamento(codice.Split('.')[0]).Result.ForEach(squadra => lstSquadre.Add(squadra)));

                return lstSquadre;
            })
            .ContinueWith(squadre => //MAPPING DATI
            {
                var lstSquadre = new ConcurrentBag<ComposizioneSquadra>();

                Parallel.ForEach(squadre.Result, squadra => lstSquadre.Add(new ComposizioneSquadra()
                {
                    Squadra = new SquadraComposizione()
                    {
                        Id = squadra.Id,
                        Stato = lstStatiSquadre.Result.Find(statosquadra => statosquadra.IdSquadra.Equals(squadra.Codice))?.StatoSquadra ?? Costanti.MezzoInSede,
                        Codice = squadra.Codice,
                        ListaCodiciFiscaliComponentiSquadra = squadra.Membri.Select(m => m.CodiceFiscale).ToList(),
                        Turno = squadra.TurnoAttuale,
                        Nome = squadra.Descrizione,
                        //Distaccamento = lstSedi.Where(s => s.Id.Equals(squadra.Distaccamento)).Select(s => new Sede(s.CodSede, s.DescDistaccamento, s.Indirizzo, s.Coordinate, "", "", "", "", "")).FirstOrDefault(),
                        DataInServizio = squadra.Membri.Min(m => m.Presenze.Min(p => p.Da)),
                        //IstanteTermineImpegno = squadra.Membri.Max(m => m.Presenze.Max(p => p.A)),
                        //IndiceOrdinamento = GetIndiceOrdinamento(s, query.Richiesta),
                        Componenti = squadra.Membri.Select(m =>
                        {
                            var a = _getAnagrafica.GetByCodFiscale(m.CodiceFiscale);

                            return new Componente()
                            {
                                OrarioFine = m.Presenze.Max(p => p.A),
                                OrarioInizio = m.Presenze.Min(p => p.Da),
                                DescrizioneQualifica = m.Ruolo,
                                Nominativo = $"{a.Result.Nome} {a.Result.Cognome}",
                                CodiceFiscale = a.Result.CodFiscale,
                            };
                        }).ToList()
                    },
                    MezziPreaccoppiati = squadra.CodiciMezziPreaccoppiati?.SelectMany(codice => _getMezzi.Get(query.CodiciSede.ToList(), null, codice).Result.Select(mezzo => new MezzoPreaccoppiato()
                    {
                        Codice = mezzo.Codice,
                        Stato = mezzo.Stato,
                        Tipo = mezzo.Genere
                    })).ToList()

                }));

                return lstSquadre;
            });

            return lstSquadreComposizione.Result.ToList();
        }
    }
}
