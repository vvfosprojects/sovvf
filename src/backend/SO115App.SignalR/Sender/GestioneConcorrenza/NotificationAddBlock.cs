using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneConcorrenza
{
    public class NotificationAddBlock : INotificationAddBlock
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        private readonly IGetRichiesta _getRichiesta;
        private readonly IGetUtenteByCF _getUtente;
        private readonly IGetStatoMezzi _getMezzo;
        private readonly IGetStatoSquadra _getSquadra;
        private readonly IGetTurno _getTurno;

        private readonly IGetMezziUtilizzabili _getMezzi;
        private readonly IGetSquadre _getSquadre;
        private readonly IGetSottoSediByCodSede _getSottoSedi;

        public NotificationAddBlock(IHubContext<NotificationHub> NotificationHubContext,
                                    GetGerarchiaToSend getGerarchiaToSend,
                                    IGetRichiesta getRichiesta,
                                    IGetTurno getTurno,
                                    IGetUtenteByCF getUtente,
                                    IGetStatoMezzi getMezzo,
                                    IGetStatoSquadra getSquadra,
                                    IGetMezziUtilizzabili getMezzi,
                                    IGetSquadre getSquadre,
                                    IGetSottoSediByCodSede getSottoSedi)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getRichiesta = getRichiesta;
            _getTurno = getTurno;
            _getSquadra = getSquadra;
            _getMezzo = getMezzo;
            _getUtente = getUtente;

            _getMezzi = getMezzi;
            _getSquadre = getSquadre;
            _getSottoSedi = getSottoSedi;
        }

        public async Task SendNotification(AddBlockCommand command)
        {
            var sediAllertate = new List<string>();

            if (command.concorrenza.Count > 0)
            {
                sediAllertate = getSedi(command.concorrenza[0].Type, command.concorrenza[0].Value, command.CodComando);
            }

            var SediDaNotificare = _getGerarchiaToSend.Get(command.CodComando, sediAllertate.ToArray());

            foreach (var sede in SediDaNotificare)
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyConcorrenza", command.concorrenza);
            }
        }

        private List<string> getSedi(TipoOperazione tipo, string value, string codSede)
        {
            var lstSedi = new List<string>();

            switch (tipo)
            {
                case TipoOperazione.EliminaUtente:
                    lstSedi.Add(getSedeUtente(value)); break;

                case TipoOperazione.Mezzo:
                    lstSedi.Add(getSedeMezzo(value, codSede)); break;

                case TipoOperazione.Squadra:
                    lstSedi.Add(getSedeSquadra(value, _getTurno.Get().Codice.Substring(0, 1), codSede)); break;

                case TipoOperazione.Richiesta:
                    lstSedi.AddRange(getSedeRichiesta(value)); break;

                #region Associazioni

                //utente
                case TipoOperazione.AggiungiRuoloUtente: goto case TipoOperazione.EliminaUtente;
                case TipoOperazione.EliminaRuoloUtente: goto case TipoOperazione.EliminaUtente;

                //richiesta
                case TipoOperazione.ChiusuraIntervento: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Modifica: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Trasferimento: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Sganciamento: goto case TipoOperazione.Richiesta;
                case TipoOperazione.InvioPartenza: goto case TipoOperazione.Richiesta;
                case TipoOperazione.GestisciPartenza: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Allerta: goto case TipoOperazione.Richiesta;
                case TipoOperazione.Fonogramma: goto case TipoOperazione.Richiesta;
                case TipoOperazione.EntiIntervenuti: goto case TipoOperazione.Richiesta;

                    #endregion
            }

            return lstSedi;
        }

        private string getSedeUtente(string value)
        {
            return _getUtente.Get(value).Sede.Codice;
        }

        private string getSedeMezzo(string value, string codSede)
        {
            var lstMezzi = _getMezzo.Get(codSede);

            var codiceSede = lstMezzi.FirstOrDefault(m => m.CodiceMezzo.Equals(value))?.CodiceSede;

            if (codiceSede == null)
                codiceSede = _getMezzi.GetInfo(new List<string> { value }).Result.Find(m => m.CodiceMezzo.Contains(value)).CodiceDistaccamento;

            return codiceSede;
        }

        private string getSedeSquadra(string value, string turno, string codSede)
        {
            var lstSquadre = _getSquadra.Get(turno);
            var squadra = lstSquadre.FirstOrDefault(s => s.IdSquadra.Equals($"{value}_{turno}"));

            string codiceSede;

            if (squadra == null)
            {
                var codiciSede = _getSottoSedi.Get(new string[] { codSede }).Where(s => s.Contains('.')).Select(s => s.Split('.')[0]).Distinct();

                var squadre = codiciSede.SelectMany(s => _getSquadre.GetAllByCodiceDistaccamento(s).Result.Squadre);

                var ss = squadre.FirstOrDefault(s => s.Codice.Contains(value) && s.TurnoAttuale.Contains(turno));

                codiceSede = ss.Distaccamento;
            }
            else
            {
                codiceSede = squadra.CodiceSede;
            }

            return codiceSede;
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

            return result.ToArray();
        }
    }
}
