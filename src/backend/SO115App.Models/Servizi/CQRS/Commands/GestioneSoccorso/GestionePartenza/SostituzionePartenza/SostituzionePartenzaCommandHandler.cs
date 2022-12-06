using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaCommandHandler : ICommandHandler<SostituzionePartenzaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;
        private readonly IGetMaxCodicePartenza _getMaxCodicePartenza;
        private readonly IModificaInterventoChiuso _modificaIntervento;
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IUpdateStatoPartenze _upDatePartenza;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetTurno _getTurno;
        private readonly ISendSTATRIItem _sendNewItemSTATRI;
        private readonly ICheckCongruitaPartenze _checkCongruita;

        public SostituzionePartenzaCommandHandler(IGetTipologieByCodice getTipologie, IUpDateRichiestaAssistenza updateRichiesta,
                                                  IGetMaxCodicePartenza getMaxCodicePartenza, IModificaInterventoChiuso modificaIntervento,
                                                  IUpdateStatoPartenze upDatePartenza, IGetRichiesta getRichiestaById, IGetTurno getTurno,
                                                  ISendSTATRIItem sendNewItemSTATRI, ICheckCongruitaPartenze checkCongruita)
        {
            _updateRichiesta = updateRichiesta;
            _getMaxCodicePartenza = getMaxCodicePartenza;
            _modificaIntervento = modificaIntervento;
            _getTipologie = getTipologie;
            _upDatePartenza = upDatePartenza;
            _getRichiestaById = getRichiestaById;
            _getTurno = getTurno;
            _sendNewItemSTATRI = sendNewItemSTATRI;
            _checkCongruita = checkCongruita;
        }

        public async void Handle(SostituzionePartenzaCommand command)
        {
            var richiestaOld = _getRichiestaById.GetByCodice(command.Richiesta.Codice);

            //FASE 1
            //Reperimento Partenze aperte sull'intervento
            var partenzeAperteIntervento = richiestaOld.Partenze.ToList().FindAll(p => p.Partenza.PartenzaAnnullata == false && p.Partenza.Terminata == false && p.Partenza.Sganciata == false);

            //FASE 2
            //Elenco Partenze interessate dalla sostituzione
            var partenzeDaSostituire = partenzeAperteIntervento.FindAll(p => command.sostituzione.Sostituzioni.Any(s => s.CodMezzo.Equals(p.CodiceMezzo)));

            //FASE 3
            //Chiusura Vecchie Partenze
            foreach (var partenza in partenzeAperteIntervento)
            {
                //Chiudo solo le partenze da sostituire. Le partenze non interessate dalla sostituzione non verranno lavorate
                if (partenzeDaSostituire.Contains(partenza))
                {
                    richiestaOld.Partenze.ToList().Find(p => p.CodicePartenza.Equals(partenza.CodicePartenza)).Partenza.Terminata = true;

                    partenza.Partenza.Terminata = true;

                    AggiornaStatoMezzoCommand statoMezzoPartenza = new AggiornaStatoMezzoCommand()
                    {
                        CodiciSede = new string[] { partenza.Partenza.Mezzo.Appartenenza },
                        IdMezzo = partenza.CodiceMezzo,
                        Richiesta = richiestaOld,
                        StatoMezzo = Costanti.MezzoRientrato,
                        CodicePartenza = partenza.CodicePartenza
                    };

                    //new PartenzaRientrata(richiestaOld, partenza.CodiceMezzo, DateTime.UtcNow, command.sostituzione.idOperatore, partenza.CodicePartenza);

                    richiestaOld.CambiaStatoPartenza(partenza.Partenza, new CambioStatoMezzo()
                    {
                        CodMezzo = partenza.CodiceMezzo,
                        Istante = DateTime.UtcNow,
                        Stato = Costanti.MezzoRientrato
                    }, _sendNewItemSTATRI, _checkCongruita, command.sostituzione.idOperatore, new string[2] { partenza.Partenza.Coordinate.Latitudine, partenza.Partenza.Coordinate.Longitudine }, partenza.CodicePartenza);

                    _upDatePartenza.Update(statoMezzoPartenza);
                }
            };

            //FASE 4
            //Creazione nuove partenze
            foreach (var sostituzione in command.sostituzione.Sostituzioni)
            {
                var ElencoSquadre = CheckElencoSquadre(command, partenzeDaSostituire, sostituzione.CodMezzo);

                var codicePartenza = command.Richiesta.Codice.Substring(0, 2) + (_getMaxCodicePartenza.GetMax() + 1).ToString();
                //FASE 5
                //Creazione Note e Evento SostituzionePartenzaFineTurno
                string note = $"Nel mezzo {sostituzione.CodMezzo} ora si trovano le squadre {String.Join(",", ElencoSquadre.Select(s => s.Codice))}";
                SostituzionePartenzaFineTurno sos = new SostituzionePartenzaFineTurno(richiestaOld, sostituzione.CodMezzo, DateTime.UtcNow.AddSeconds(-2), command.sostituzione.idOperatore, note, codicePartenza);

                var NuovaPartenza = new ComposizionePartenze(richiestaOld, DateTime.UtcNow.AddSeconds(-1), command.sostituzione.idOperatore, false, new Partenza()
                {
                    Codice = codicePartenza,
                    Mezzo = partenzeDaSostituire.Select(m => m.Partenza.Mezzo).Where(m => m.Codice.Equals(sostituzione.CodMezzo)).FirstOrDefault(),
                    Squadre = ElencoSquadre,
                    Turno = _getTurno.Get().Codice,
                    Coordinate = richiestaOld.Localita.Coordinate.ToCoordinateString()
                }, richiestaOld.Localita.Coordinate.ToCoordinateString());

                new ArrivoSulPosto(richiestaOld, NuovaPartenza.CodiceMezzo, DateTime.UtcNow, command.sostituzione.idOperatore, NuovaPartenza.CodicePartenza);

                AggiornaStatoMezzoCommand AggStatoMezzo = new AggiornaStatoMezzoCommand()
                {
                    CodiciSede = new string[] { NuovaPartenza.Partenza.Mezzo.Appartenenza },
                    IdMezzo = sostituzione.CodMezzo,
                    Richiesta = richiestaOld,
                    StatoMezzo = Costanti.MezzoSulPosto,
                    CodicePartenza = NuovaPartenza.CodicePartenza
                };

                _upDatePartenza.Update(AggStatoMezzo);
            }

            //FASE 6
            //Invio a GAC degli aggiornamenti
            command.Richiesta = richiestaOld;
        }

        private List<Squadra> CheckElencoSquadre(SostituzionePartenzaCommand command, List<ComposizionePartenze> partenzeDaSostiturie, string CodMezzoDaElaborare)
        {
            List<Squadra> NuoveSquadreNellaPartenza = new List<Squadra>();
            var elencoVecchieSquadre = partenzeDaSostiturie.Find(p => p.CodiceMezzo.Equals(CodMezzoDaElaborare)).Partenza.Squadre;
            var elencoNuoveSquadre = command.sostituzione.Sostituzioni.Find(s => s.CodMezzo.Equals(CodMezzoDaElaborare)).CodSquadre;
            var elencoNuoveSquadreDaInserireNelMezzo = partenzeDaSostiturie.Select(p => p.Partenza.Squadre).Where(s => s.Any(s => elencoNuoveSquadre.Any(ens => ens.Contains(s.Codice))));

            foreach (var listaSquadre in elencoNuoveSquadreDaInserireNelMezzo)
            {
                foreach (var squadra in listaSquadre)
                {
                    if (elencoNuoveSquadre.Contains(squadra.Codice))
                        NuoveSquadreNellaPartenza.Add(squadra);
                }
            }

            var elencoSquadrePresentiNelleSostituzioni = new List<String>();
            foreach (var sostituzione in command.sostituzione.Sostituzioni)
                elencoSquadrePresentiNelleSostituzioni.AddRange(sostituzione.CodSquadre);

            //Verifico se ci sono squadre nella vecchia partenza non incluse nella sostituzione
            foreach (var squadra in elencoVecchieSquadre.Where(s => !elencoSquadrePresentiNelleSostituzioni.Contains(s.Codice)))
                NuoveSquadreNellaPartenza.Add(squadra);

            return NuoveSquadreNellaPartenza;
        }
    }
}
