﻿using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using System;
using System.Collections.Generic;
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
        private readonly IGetTipologieByCodice _getTipologie;

        public SostituzionePartenzaCommandHandler(IGetTipologieByCodice getTipologie, IUpDateRichiestaAssistenza updateRichiesta, ISetRientroMezzo rientroMezzo, ISetUscitaMezzo uscitaMezzo, IGetMaxCodicePartenza getMaxCodicePartenza, IModificaInterventoChiuso modificaIntervento)
        {
            _updateRichiesta = updateRichiesta;
            _rientroMezzo = rientroMezzo;
            _uscitaMezzo = uscitaMezzo;
            _getMaxCodicePartenza = getMaxCodicePartenza;
            _modificaIntervento = modificaIntervento;
            _getTipologie = getTipologie;
        }

        public async void Handle(SostituzionePartenzaCommand command)
        {
            command.sostituzione.Sostituzioni.ForEach(sostituzione =>
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

                #endregion GESTIONE RICHIESTA E EVENTI RICIHESTA

                #region Comunicazione a servizi GAC

                var tipologia = _getTipologie.Get(new List<string> { command.Richiesta.Tipologie.First() }).First();

                _modificaIntervento.Send(new ModificaMovimentoGAC()
                {
                    targa = PartenzaMontanteNuova.CodiceMezzo.Split('.', StringSplitOptions.RemoveEmptyEntries)[1],
                    idPartenza = PartenzaMontanteNuova.CodicePartenza,
                    autistaRientro = PartenzaMontanteNuova.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica == "DRIVER").Nominativo, 
                    autistaUscita = PartenzaMontanteNuova.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica == "DRIVER").Nominativo, 
                    tipoMezzo = PartenzaMontanteNuova.Partenza.Mezzo.Codice.Split('.', StringSplitOptions.RemoveEmptyEntries)[0],
                    dataRientro = PartenzaSmontante.Istante, 
                    dataUscita = PartenzaSmontante.Istante, 

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

                _modificaIntervento.Send(new ModificaMovimentoGAC()
                {
                    targa = PartenzaSmontanteNuova.CodiceMezzo.Split('.', StringSplitOptions.RemoveEmptyEntries)[1],
                    idPartenza = PartenzaSmontanteNuova.CodicePartenza,
                    autistaRientro = PartenzaSmontanteNuova.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica == "DRIVER").Nominativo,
                    autistaUscita = PartenzaSmontanteNuova.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica == "DRIVER").Nominativo, 
                    tipoMezzo = PartenzaSmontanteNuova.Partenza.Mezzo.Codice.Split('.', StringSplitOptions.RemoveEmptyEntries)[0],
                    dataRientro = PartenzaSmontanteNuova.Istante, 
                    dataUscita = PartenzaSmontanteNuova.Istante, 

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

                #endregion Comunicazione a servizi GAC

                _updateRichiesta.UpDate(command.Richiesta);
            });
        }
    }
}
