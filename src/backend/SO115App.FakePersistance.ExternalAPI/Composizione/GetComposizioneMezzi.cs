using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoMezzi _getMezziPrenotati;

        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IGetTurno _getTurno;
        //private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        //private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;

        public GetComposizioneMezzi(//IGetPersonaleByCF getPersonaleByCF,
            //IGetSquadre getSquadre,
            //IGetStatoSquadra getStatoSquadre,
            IGetStatoMezzi getMezziPrenotati,
            IGetMezziUtilizzabili getMezziUtilizzabili,
            //IGetPreAccoppiati getPreAccoppiati,

            IGetTipologieByCodice getTipologieByCodice,
            IGetTurno getTurno//,
            //IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            /*IGetListaDistaccamentiByPinListaSedi getDistaccamenti*/)

        {
            //_getPersonaleByCF = getPersonaleByCF;
            //_getSquadre = getSquadre;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            //_getStatoSquadre = getStatoSquadre;
            //_getPreAccoppiati = getPreAccoppiati;
            _getTipologieByCodice = getTipologieByCodice;
            _getTurno = getTurno;
            //_getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            //_getDistaccamenti = getDistaccamenti;
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiciSedi);

            var lstMezziComposizione = _getMezziUtilizzabili.Get(query.CodiciSedi.ToList())
            //MAPPING
            .ContinueWith(lstMezzi => lstMezzi.Result.Select(m =>
            {
                //m.PreAccoppiato = lstPreaccoppiati.FirstOrDefault(p => p.MezzoComposizione.Mezzo.Codice == m.Codice)?.MezzoComposizione.Mezzo.PreAccoppiato ?? false;

                var mc = new ComposizioneMezzi()
                {
                    Id = m.Codice,
                    Mezzo = m,
                    Km = new Random().Next(1, 60).ToString(),
                    TempoPercorrenza = Math.Round(Convert.ToDouble(new Random().Next(1, 60).ToString().Replace(".", ",")) / 1.75, 2).ToString(CultureInfo.InvariantCulture),
                    //SquadrePreaccoppiate = lstPreaccoppiati.FirstOrDefault(p => p.MezzoComposizione.Id == m.Codice)?.SquadreComposizione
                };

                var statoMezzo = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice));
                if (statoMezzo != null) switch (mc.Mezzo.Stato)
                    {
                        case Costanti.MezzoInSede:
                            mc.Mezzo.Stato = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice)).StatoOperativo;
                            break;

                        case Costanti.MezzoInViaggio:
                            mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                            break;

                        case Costanti.MezzoSulPosto:
                            mc.IndirizzoIntervento = query.Richiesta.Localita.Indirizzo;
                            mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                            break;

                        case Costanti.MezzoInRientro:
                            //mc.ListaSquadre = lstSquadreComposizione.Result.FindAll(x => statiOperativiSquadre.FindAll(x =>
                            //    x.CodMezzo.Equals(mc.Mezzo.Codice)).Select(x => x.IdSquadra).Any(s => s.Equals(x.Squadra.Codice)));

                            mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                            break;
                    }

                return mc;
            }));

            //TODO FILTRI E ORDINAMENTI
            //.ContinueWith(lstCompMezzi => FiltraOrdina(query, lstCompMezzi.Result));

            return lstMezziComposizione.Result.ToList();
        }

        private List<ComposizioneMezzi> FiltraOrdina(ComposizioneMezziQuery query, IEnumerable<ComposizioneMezzi> lstCompMezzi)
        {
            return lstCompMezzi.ToList();
                //.Where(m => query.Filtro.StatoMezzo?.Contains(m.Mezzo.Stato.ToString()) ?? true)
                //.Where(m =>
                //{
                //    if (!string.IsNullOrEmpty(query.Filtro.RicercaMezzi))
                //        return m.Mezzo.Codice.Contains(query.Filtro.RicercaMezzi) || m.Mezzo.Descrizione.Contains(query.Filtro.RicercaMezzi);
                //    return true;
                //})
                //.Where(m =>
                //{
                //    if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.All(c => c != ""))
                //        return query.Filtro.CodiceDistaccamento.Contains(m.Mezzo.Distaccamento.Codice);
                //    return true;
                //})
                //.Where(m =>
                //{
                //    if (query.Filtro.TipoMezzo != null && query.Filtro.TipoMezzo.All(c => c != ""))
                //        return query.Filtro.TipoMezzo.Contains(m.Mezzo.Genere);
                //    return true;
                //}).Where(m =>
                //{
                //    if (query.Filtro.StatoMezzo != null && query.Filtro.StatoMezzo.All(c => c != ""))
                //        return query.Filtro.StatoMezzo.Contains(m.Mezzo.Stato);
                //    return true;
                //}).Where(s =>
                //{
                //    if (query.Filtro.Squadre != null && query.Filtro.Squadre.Count > 0 && query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice != null)
                //        return s.Mezzo.Distaccamento.Codice == query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice;
                //    return true;
                //})
                //.OrderByDescending(c =>
                //{
                //    if (query.Filtro.Squadre?.Any(s => s.PreAccoppiato) ?? false)
                //        return c.Mezzo.PreAccoppiato;
                //    return false;
                //})
                //.OrderByDescending(m => m.Mezzo.Stato == Costanti.MezzoInSede)
                //.ThenByDescending(m => m.Mezzo.Stato == Costanti.MezzoInRientro)
                //.ThenByDescending(m => m.Mezzo.Stato == Costanti.MezzoInViaggio)
                //.ThenByDescending(m => m.Mezzo.Stato == Costanti.MezzoSulPosto)
                ////.ThenByDescending(m => m.IndiceOrdinamento)
                //.ToList();
        }
    }
}
