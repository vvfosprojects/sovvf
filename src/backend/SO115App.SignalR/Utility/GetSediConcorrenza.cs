using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.SignalR.Utility
{
    public class GetSediConcorrenza : IGetSediConcorrenza
    {
        private readonly IGetRichiesta _getRichiesta;
        private readonly IGetTurno _getTurno;
        private readonly IGetUtenteByCF _getUtente;
        private readonly IGetStatoMezzi _getMezzo;
        private readonly IGetStatoSquadra _getSquadra;
        private readonly IGetMezziUtilizzabili _getMezzi;
        private readonly IGetSquadre _getSquadre;
        private readonly IGetSottoSediByCodSede _getSottoSedi;
        private readonly IGetComposizioneSquadre _getComposizioneSquadre;

        public GetSediConcorrenza(IGetRichiesta getRichiesta, IGetTurno getTurno, IGetUtenteByCF getUtente,
            IGetStatoMezzi getMezzo,
            IGetStatoSquadra getSquadra, IGetMezziUtilizzabili getMezzi, IGetSquadre getSquadre,
            IGetSottoSediByCodSede getSottoSedi, IGetComposizioneSquadre getComposizioneSquadre)
        {
            _getRichiesta = getRichiesta;
            _getTurno = getTurno;
            _getSquadra = getSquadra;
            _getMezzo = getMezzo;
            _getUtente = getUtente;

            _getMezzi = getMezzi;
            _getSquadre = getSquadre;
            _getSottoSedi = getSottoSedi;
            _getComposizioneSquadre = getComposizioneSquadre;
        }

        public List<string> Get(TipoOperazione tipo, string value, string codSede)
        {
            var lstSedi = new List<string>();

            switch (tipo)
            {
                case TipoOperazione.EliminaUtente:
                    lstSedi.AddRange(getSedeUtente(value)); break;

                case TipoOperazione.Mezzo:
                    lstSedi.AddRange(getSedeMezzo(value, codSede)); break;

                case TipoOperazione.Squadra:
                    lstSedi.AddRange(getSedeSquadra(value, _getTurno.Get().Codice.Substring(0, 1), codSede)); break;

                case TipoOperazione.Richiesta:
                    lstSedi.AddRange(getSedeRichiesta(value)); break;

                #region Associazioni

                //utente
                case TipoOperazione.AggiungiRuoloUtente: goto case TipoOperazione.EliminaUtente;
                case TipoOperazione.EliminaRuoloUtente: goto case TipoOperazione.EliminaUtente;

                //richiesta
                case TipoOperazione.ChiusuraChiamata: goto case TipoOperazione.Richiesta;
                case TipoOperazione.ChiusuraIntervento: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Modifica: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Trasferimento: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Sganciamento: goto case TipoOperazione.Richiesta;
                case TipoOperazione.InvioPartenza: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Allerta: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Fonogramma: goto case TipoOperazione.Richiesta;
                case TipoOperazione.EntiIntervenuti: goto case TipoOperazione.Richiesta;

                //mezzo
                case TipoOperazione.CambioStatoPartenza: goto case TipoOperazione.Mezzo;
                case TipoOperazione.GestisciPartenza: goto case TipoOperazione.Mezzo;

                    #endregion Associazioni
            }

            return lstSedi;
        }

        private string[] getSedeUtente(string value)
        {
            return _getUtente.Get(value).Ruoli.Select(r => r.CodSede).Distinct().ToArray();
        }

        private string[] getSedeMezzo(string value, string codSede)
        {
            var lstMezzi = _getMezzo.Get(codSede);

            var mezzo = lstMezzi.FirstOrDefault(m => m.CodiceMezzo.Equals(value) && !m.StatoOperativo.Equals("Rientrato"));

            var codiciSede = new List<string> { };

            if (mezzo == null)
            {
                codiciSede.Add(_getMezzi.GetInfo(new List<string> { value }).Result.Find(m => m.CodiceMezzo.Contains(value)).CodiceDistaccamento);
            }
            else
            {
                var richiesta = _getRichiesta.GetByCodice(mezzo.CodiceRichiesta);

                codiciSede.Add(richiesta.CodSOCompetente);

                if (richiesta.CodSOAllertate != null && richiesta.CodSOAllertate.Count > 0)
                    codiciSede.AddRange(richiesta.CodSOAllertate);
            }

            return codiciSede.Distinct().ToArray();
        }

        private string[] getSedeSquadra(string value, string turno, string codSede)
        {
            //var lstSquadre = _getSquadra.Get(turno);

            ComposizioneSquadreQuery query = new ComposizioneSquadreQuery()
            {
                CodiciSede = new string[1] { codSede.Split('.')[0] },
                Filtro = new Models.Classi.Composizione.FiltriComposizioneSquadra()
            };

            var lstSquadreOpService = _getComposizioneSquadre.Get(query);

            var codiciSede = new List<string> { };

            codiciSede = _getSottoSedi.Get(new string[] { codSede }).Where(s => s.Contains('.')).Select(s => s.Split('.')[0]).Distinct().ToList();

            var ss = lstSquadreOpService.FirstOrDefault(s => s.IdSquadra.Contains(value) && turno.ToCharArray().Contains(s.Turno));

            codiciSede.Add(ss.Distaccamento.Codice);

            return codiciSede.Distinct().ToArray();
        }

        private string[] getSedeRichiesta(string value)
        {
            RichiestaAssistenza richiesta = null;
            var result = new List<string>();

            if (value.Split('-').Length == 2)
                richiesta = _getRichiesta.GetByCodiceRichiesta(value);
            else
                richiesta = _getRichiesta.GetByCodice(value);

            result.Add(richiesta.CodSOCompetente);

            if (richiesta.CodSOAllertate != null)
                result.AddRange(richiesta.CodSOAllertate?.ToList());

            return result.Distinct().ToArray();
        }
    }
}
