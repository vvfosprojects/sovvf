using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationModificaPartenza : INotifyModificaPartenza
    {
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly IConfiguration _config;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;

        public NotificationModificaPartenza(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
            IMapperRichiestaSuSintesi mapperSintesi, IConfiguration config)
        {
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
            _mapperSintesi = mapperSintesi;
            _config = config;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _boxRichiesteHandler = boxRichiesteHandler;
        }

        public async Task SendNotification(ModificaPartenzaCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            var confermaPartenza = new ConfermaPartenze()
            {
                CodiceSede = command.CodSede.First(),
                IdOperatore = command.IdOperatore,
                IdRichiesta = command.Richiesta.Id,
                Chiamata = _mapperSintesi.Map(command.Richiesta),
                Partenze = command.Richiesta.lstPartenze,
                richiesta = command.Richiesta
            };

            var infoDaInviare = new List<InfoDaInviareModificaPartenza>();

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                var info = new InfoDaInviareModificaPartenza();

                info.codiceSede = sede;

                info.boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery() { CodiciSede = new string[] { sede } }).BoxRichieste;
                info.boxMezzi = _boxMezziHandler.Handle(new BoxMezziQuery() { CodiciSede = new string[] { sede } }).BoxMezzi;
                info.boxPersonale = _boxPersonaleHandler.Handle(new BoxPersonaleQuery() { CodiciSede = new string[] { sede } }).BoxPersonale;

                infoDaInviare.Add(info);
            });

            foreach (var info in infoDaInviare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.boxInterventi, info.codiceSede);
                await hubConnection.InvokeAsync("NotifyGetBoxMezzi", info.boxMezzi, info.codiceSede);
                await hubConnection.InvokeAsync("NotifyGetBoxPersonale", info.boxPersonale, info.codiceSede);
                await hubConnection.InvokeAsync("ModifyAndNotifySuccessPartenza", confermaPartenza, info.codiceSede);

                foreach (var partenza in command.Richiesta.lstPartenze)
                {
                    await hubConnection.InvokeAsync("NotifyUpdateMezzoInServizio", new MezzoInServizio()
                    {
                        Mezzo = new MezzoMarker()
                        {
                            Mezzo = partenza.Mezzo,
                            InfoRichiesta = new InfoRichiesta()
                            {
                                CodiceRichiesta = command.Richiesta.Codice,
                                Indirizzo = command.Richiesta.Localita.Indirizzo
                            }
                        },
                        Squadre = partenza.Squadre
                    }, info.codiceSede);
                }

                await hubConnection.StopAsync();
            }
        }
    }

    internal class InfoDaInviareModificaPartenza
    {
        public string codiceSede { get; set; }
        public BoxInterventi boxInterventi { get; set; }
        public BoxMezzi boxMezzi { get; set; }
        public BoxPersonale boxPersonale { get; set; }
    }
}
