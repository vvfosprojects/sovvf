using CQRS.Commands.Notifiers;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaNotifier : ICommandNotifier<SostituzionePartenzaCommand>
    {
        private readonly INotifyModificaPartenza _notifier;
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IModificaInterventoChiuso _modificaIntervento;

        public SostituzionePartenzaNotifier(INotifyModificaPartenza notifier, IGetTipologieByCodice getTipologie,
                                            IModificaInterventoChiuso modificaIntervento)
        {
            _notifier = notifier;
            _getTipologie = getTipologie;
            _modificaIntervento = modificaIntervento;
        }

        public void Notify(SostituzionePartenzaCommand command)
        {
            var modificaPartenza = new ModificaPartenzaCommand()
            {
                CodSede = new string[] { command.Richiesta.CodSOCompetente },
                IdOperatore = command.sostituzione.idOperatore,
                Richiesta = command.Richiesta
            };

            _notifier.SendNotification(modificaPartenza);

            var tipologia = _getTipologie.Get(new List<string> { command.Richiesta.Tipologie.Select(t => t.Codice).First() }).First();

            Task.Run(() =>
            {
                foreach (var composizione in command.Richiesta.Partenze.Where(p => p.Partenza.Terminata == false && p.Partenza.Sganciata == false && p.Partenza.PartenzaAnnullata == false))
                {
                    _modificaIntervento.Send(new ModificaMovimentoGAC()
                    {
                        targa = composizione.CodiceMezzo.Split('.', StringSplitOptions.RemoveEmptyEntries)[1],
                        idPartenza = composizione.CodicePartenza,
                        autistaRientro = composizione.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica == "DRIVER").CodiceFiscale,
                        autistaUscita = composizione.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica == "DRIVER").CodiceFiscale,
                        tipoMezzo = composizione.Partenza.Mezzo.Codice.Split('.', StringSplitOptions.RemoveEmptyEntries)[0],
                        dataRientro = composizione.Istante,
                        dataUscita = composizione.Istante,

                        comune = new ComuneGAC() { codice = "", descrizione = command.Richiesta.Localita.Citta },
                        localita = command.Richiesta.Localita.Indirizzo,
                        provincia = new ProvinciaGAC() { codice = "", descrizione = command.Richiesta.Localita.Provincia ?? "" },
                        latitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                        longitudine = command.Richiesta.Localita.Coordinate.Longitudine.ToString(),
                        dataIntervento = command.Richiesta.dataOraInserimento,
                        numeroIntervento = command.Richiesta.CodRichiesta,
                        tipoUscita = new TipoUscita()
                        {
                            codice = tipologia.Codice,
                            descrizione = tipologia.Descrizione
                        }
                    });
                }
            });
        }
    }
}
