﻿using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaCommandHandler : ICommandHandler<SostituzionePartenzaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;
        private readonly ISetRientroMezzo _rientroMezzo;
        private readonly ISetUscitaMezzo _uscitaMezzo;
        private readonly IGetMaxCodicePartenza _getMaxCodicePartenza;
        private readonly IModificaInterventoChiuso _modificaIntervento;

        public SostituzionePartenzaCommandHandler(IUpDateRichiestaAssistenza updateRichiesta, ISetRientroMezzo rientroMezzo, ISetUscitaMezzo uscitaMezzo, IGetMaxCodicePartenza getMaxCodicePartenza, IModificaInterventoChiuso modificaIntervento)
        {
            _updateRichiesta = updateRichiesta;
            _rientroMezzo = rientroMezzo;
            _uscitaMezzo = uscitaMezzo;
            _getMaxCodicePartenza = getMaxCodicePartenza;
            _modificaIntervento = modificaIntervento;
        }

        public async void Handle(SostituzionePartenzaCommand command)
        {
            Parallel.ForEach(command.sostituzione.Sostituzioni, sostituzione =>
            {
                #region GESTIONE NOTE

                string NoteSquadreSmontanti = "";
                string NoteSquadreMontanti = "";
                if (sostituzione.SquadreSmontanti.Count() > 1)
                {
                    foreach (var squadra in sostituzione.SquadreSmontanti)
                    {
                        NoteSquadreSmontanti = NoteSquadreSmontanti + squadra + ",";
                    }

                    NoteSquadreSmontanti = "Le squadre " + NoteSquadreSmontanti.Substring(0, NoteSquadreSmontanti.Length - 1) + " vengono sostituite ";
                }
                else NoteSquadreSmontanti = "La squadra " + sostituzione.SquadreSmontanti[0] + " viene sostituita ";

                if (sostituzione.SquadreMontanti.Count() > 1)
                {
                    foreach (var squadra in sostituzione.SquadreMontanti)
                    {
                        NoteSquadreMontanti = NoteSquadreMontanti + squadra + ",";
                    }

                    NoteSquadreMontanti = " dalle squadre " + NoteSquadreMontanti.Substring(0, NoteSquadreMontanti.Length - 1);
                }
                else NoteSquadreMontanti = " dalla squadra " + sostituzione.SquadreMontanti[0];

                string Note = NoteSquadreSmontanti + NoteSquadreMontanti + " sul mezzo " + sostituzione.CodMezzoSmontante + " tornando in sede con il mezzo " + sostituzione.CodMezzoMontante;

                #endregion GESTIONE NOTE

                #region GESTIONE RICHIESTA E EVENTI RICIHESTA

                new SostituzionePartenzaFineTurno(command.Richiesta, sostituzione.CodMezzoSmontante, command.sostituzione.DataOraOperazione, command.sostituzione.idOperatore, Note);

                var PartenzaMontante = command.Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Mezzo.Codice.Equals(sostituzione.CodMezzoMontante) && x.Partenza.PartenzaAnnullata == false && x.Partenza.Terminata == false && x.Partenza.Sganciata == false);
                var PartenzaSmontante = command.Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Mezzo.Codice.Equals(sostituzione.CodMezzoSmontante) && x.Partenza.PartenzaAnnullata == false && x.Partenza.Terminata == false && x.Partenza.Sganciata == false);
                var SquadreSwitch = PartenzaSmontante.Partenza.Squadre;

                //GESTIONE PARTENZA SMONTANTE
                PartenzaSmontante.Partenza.Squadre = PartenzaMontante.Partenza.Squadre;
                PartenzaSmontante.Partenza.Terminata = true;

                //GESTIONE PARTENZA MONTANTE
                PartenzaMontante.Partenza.Squadre = PartenzaSmontante.Partenza.Squadre;
                PartenzaMontante.Partenza.Terminata = true;

                //GESTIONE NUOVA PARTENZA SMONTANTE
                var PartenzaSmontanteNuova = new ComposizionePartenze(command.Richiesta, DateTime.UtcNow, command.sostituzione.idOperatore, false, new Partenza()
                {
                    Codice = PartenzaSmontante.Partenza.Mezzo.Distaccamento.Codice.Substring(0, 2) + (_getMaxCodicePartenza.GetMax() + 1).ToString(),
                    Mezzo = PartenzaSmontante.Partenza.Mezzo,
                    Squadre = PartenzaMontante.Partenza.Squadre
                });

                new PartenzaInRientro(command.Richiesta, PartenzaSmontante.CodiceMezzo, DateTime.UtcNow, command.sostituzione.idOperatore, PartenzaSmontanteNuova.CodicePartenza);

                //GESTIONE NUOVA PARTENZA MONTANTE
                var PartenzaMontanteNuova = new ComposizionePartenze(command.Richiesta, DateTime.UtcNow, command.sostituzione.idOperatore, false, new Partenza()
                {
                    Codice = PartenzaMontante.Partenza.Mezzo.Codice.Substring(0, 2) + (_getMaxCodicePartenza.GetMax() + 1).ToString(),
                    Mezzo = PartenzaMontante.Partenza.Mezzo,
                    Squadre = SquadreSwitch
                });

                new ArrivoSulPosto(command.Richiesta, PartenzaMontante.CodiceMezzo, DateTime.UtcNow, command.sostituzione.idOperatore, PartenzaMontanteNuova.CodicePartenza);

                var CodSede = PartenzaSmontante.Partenza.Mezzo.Distaccamento.Codice;

                _updateRichiesta.UpDate(command.Richiesta);

                #endregion GESTIONE RICHIESTA E EVENTI RICIHESTA

                #region Comunicazione a servizi GAC

                //RIENTRO SMONTANTE

                
                    _modificaIntervento.Send(new ModificaMovimentoGAC()
                    {
                        targa = PartenzaMontanteNuova.CodiceMezzo,
                        idPartenza = PartenzaMontanteNuova.CodicePartenza,
                        Autista = PartenzaMontanteNuova.Partenza.Squadre.SelectMany(s => s.Membri).Where(m => m.Ruolo == "DRIVER")?.Select(m => m.Nominativo)?.FirstOrDefault(),
                        Comune = new ComuneGAC() { codice = "", descrizione = command.Richiesta.Localita.Citta },
                        Localita = command.Richiesta.Localita.Indirizzo,
                        Provincia = new ProvinciaGAC() { codice = "", descrizione = command.Richiesta.Localita.Provincia ?? "" },
                        Latitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                        Longitudine = command.Richiesta.Localita.Coordinate.Longitudine.ToString(),
                        DataIntervento = command.Richiesta.dataOraInserimento,
                        NumeroIntervento = command.Richiesta.CodRichiesta,
                        tipoMezzo = PartenzaMontanteNuova.Partenza.Mezzo.Genere,
                        DataRientro = PartenzaSmontante.Istante,
                        DataUscita = PartenzaMontanteNuova.Istante,
                        TipoUscita = new TipoUscita() { codice = "", descrizione = "Sostituzione" }
                    });

                    _modificaIntervento.Send(new ModificaMovimentoGAC()
                    {
                        targa = PartenzaSmontanteNuova.CodiceMezzo,
                        idPartenza = PartenzaSmontanteNuova.CodicePartenza,
                        Autista = PartenzaSmontanteNuova.Partenza.Squadre.SelectMany(s => s.Membri).Where(m => m.Ruolo == "DRIVER")?.Select(m => m.Nominativo)?.FirstOrDefault(),
                        Comune = new ComuneGAC() { codice = "", descrizione = command.Richiesta.Localita.Citta },
                        Localita = command.Richiesta.Localita.Indirizzo,
                        Provincia = new ProvinciaGAC() { codice = "", descrizione = command.Richiesta.Localita.Provincia ?? "" },
                        Latitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                        Longitudine = command.Richiesta.Localita.Coordinate.Longitudine.ToString(),
                        DataIntervento = command.Richiesta.dataOraInserimento,
                        NumeroIntervento = command.Richiesta.CodRichiesta,
                        tipoMezzo = PartenzaSmontanteNuova.Partenza.Mezzo.Genere,
                        DataRientro = PartenzaMontante.Istante,
                        DataUscita = PartenzaSmontanteNuova.Istante,
                        TipoUscita = new TipoUscita() { codice = "", descrizione = "Sostituzione" }
                    });

                    //_rientroMezzo.Set(new RientroGAC()
                    //{
                    //    idPartenza = PartenzaSmontante.Partenza.Codice.ToString(),
                    //    dataIntervento = PartenzaSmontante.DataOraInserimento,
                    //    numeroIntervento = command.Richiesta.CodRichiesta,
                    //    dataRientro = PartenzaSmontante.DataOraInserimento,
                    //    targa = PartenzaSmontante.Partenza.Mezzo.Codice,
                    //    tipoMezzo = PartenzaSmontante.Partenza.Mezzo.Genere
                    //});

                    ////RIENTRO MONTANTE
                    //_rientroMezzo.Set(new RientroGAC()
                    //{
                    //    idPartenza = PartenzaMontante.Partenza.Codice.ToString(),
                    //    dataIntervento = PartenzaMontante.DataOraInserimento,
                    //    numeroIntervento = command.Richiesta.CodRichiesta,
                    //    dataRientro = PartenzaMontante.DataOraInserimento,
                    //    targa = PartenzaMontante.Partenza.Mezzo.Codice,
                    //    tipoMezzo = PartenzaMontante.Partenza.Mezzo.Genere
                    //});

                    ////USCITA NUOVA PARTENZA MONTANTE
                    //_uscitaMezzo.Set(new UscitaGAC()
                    //{
                    //    idPartenza = PartenzaMontanteNuova.Partenza.Codice.ToString(),
                    //    dataIntervento = PartenzaMontanteNuova.DataOraInserimento,
                    //    numeroIntervento = command.Richiesta.CodRichiesta,
                    //    dataUscita = PartenzaMontanteNuova.DataOraInserimento,
                    //    targa = PartenzaMontanteNuova.Partenza.Mezzo.Codice,
                    //    tipoMezzo = PartenzaMontanteNuova.Partenza.Mezzo.Genere
                    //});

                    ////USCITA NUOVA PARTENZA SMONTANTE
                    //_uscitaMezzo.Set(new UscitaGAC()
                    //{
                    //    idPartenza = PartenzaSmontanteNuova.Partenza.Codice.ToString(),
                    //    dataIntervento = PartenzaSmontanteNuova.DataOraInserimento,
                    //    numeroIntervento = command.Richiesta.CodRichiesta,
                    //    dataUscita = PartenzaSmontanteNuova.DataOraInserimento,
                    //    targa = PartenzaSmontanteNuova.Partenza.Mezzo.Codice,
                    //    tipoMezzo = PartenzaSmontanteNuova.Partenza.Mezzo.Genere
                    //});

                #endregion Comunicazione a servizi GAC
            });
        }
    }
}
