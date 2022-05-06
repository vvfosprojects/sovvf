﻿using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
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
        private readonly IGetMaxCodicePartenza _getMaxCodicePartenza;
        private readonly IModificaInterventoChiuso _modificaIntervento;
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IUpdateStatoPartenze _upDatePartenza;
        private readonly IGetRichiesta _getRichiestaById;

        public SostituzionePartenzaCommandHandler(IGetTipologieByCodice getTipologie, IUpDateRichiestaAssistenza updateRichiesta,
                                                  IGetMaxCodicePartenza getMaxCodicePartenza, IModificaInterventoChiuso modificaIntervento,
                                                  IUpdateStatoPartenze upDatePartenza, IGetRichiesta getRichiestaById)
        {
            _updateRichiesta = updateRichiesta;
            _getMaxCodicePartenza = getMaxCodicePartenza;
            _modificaIntervento = modificaIntervento;
            _getTipologie = getTipologie;
            _upDatePartenza = upDatePartenza;
            _getRichiestaById = getRichiestaById;
        }

        public async void Handle(SostituzionePartenzaCommand command)
        {
            var tipologia = _getTipologie.Get(new List<string> { command.Richiesta.Tipologie.Select(t => t.Codice).First() }).First();

            var richiestaOld = _getRichiestaById.GetByCodice(command.Richiesta.Codice);

            var PartenzaMontante = command.Richiesta.Partenze.First(x => command.sostituzione.Sostituzioni.Any(s => s.CodMezzoMontante.Equals(x.Partenza.Mezzo.Codice)) && x.Partenza.PartenzaAnnullata == false && x.Partenza.Terminata == false && x.Partenza.Sganciata == false);
            var PartenzaSmontante = command.Richiesta.Partenze.First(x => command.sostituzione.Sostituzioni.Any(s => s.CodMezzoSmontante.Equals(x.Partenza.Mezzo.Codice)) && x.Partenza.PartenzaAnnullata == false && x.Partenza.Terminata == false && x.Partenza.Sganciata == false);
            var SquadreSwitch = PartenzaSmontante.Partenza.Squadre;

            //GESTIONE PARTENZA SMONTANTE
            PartenzaSmontante.Partenza.Squadre = PartenzaMontante.Partenza.Squadre;
            PartenzaSmontante.Partenza.Terminata = true;

            AggiornaStatoMezzoCommand statoMezzoPartenzaSmontante = new AggiornaStatoMezzoCommand();
            statoMezzoPartenzaSmontante.CodiciSede = new string[] { PartenzaSmontante.Partenza.Mezzo.Appartenenza };
            statoMezzoPartenzaSmontante.IdMezzo = PartenzaSmontante.Partenza.Mezzo.Codice;
            statoMezzoPartenzaSmontante.Richiesta = richiestaOld;
            statoMezzoPartenzaSmontante.StatoMezzo = Costanti.MezzoRientrato;
            _upDatePartenza.Update(statoMezzoPartenzaSmontante);

            //GESTIONE PARTENZA MONTANTE
            PartenzaMontante.Partenza.Squadre = PartenzaSmontante.Partenza.Squadre;
            PartenzaMontante.Partenza.Terminata = true;

            AggiornaStatoMezzoCommand statoMezzoPartenzaMontante = new AggiornaStatoMezzoCommand();
            statoMezzoPartenzaMontante.CodiciSede = new string[] { PartenzaMontante.Partenza.Mezzo.Appartenenza };
            statoMezzoPartenzaMontante.IdMezzo = PartenzaMontante.Partenza.Mezzo.Codice;
            statoMezzoPartenzaMontante.Richiesta = richiestaOld;
            statoMezzoPartenzaMontante.StatoMezzo = Costanti.MezzoRientrato;
            _upDatePartenza.Update(statoMezzoPartenzaMontante);

            //GESTIONE NUOVA PARTENZA SMONTANTE
            var PartenzaSmontanteNuova = new ComposizionePartenze(command.Richiesta, DateTime.UtcNow, command.sostituzione.idOperatore, false, new Partenza()
            {
                Codice = command.Richiesta.Codice.Substring(0, 2) + (_getMaxCodicePartenza.GetMax() + 1).ToString(),
                Mezzo = PartenzaSmontante.Partenza.Mezzo,
                Squadre = PartenzaMontante.Partenza.Squadre,
                Turno = PartenzaSmontante.Partenza.Turno,
                Coordinate = PartenzaSmontante.Partenza.Coordinate,
            });

            new PartenzaInRientro(command.Richiesta, PartenzaSmontante.CodiceMezzo, DateTime.UtcNow, command.sostituzione.idOperatore, PartenzaSmontanteNuova.CodicePartenza);

            AggiornaStatoMezzoCommand statoMezzo = new AggiornaStatoMezzoCommand();
            statoMezzo.CodiciSede = new string[] { PartenzaSmontanteNuova.Partenza.Mezzo.Appartenenza };
            statoMezzo.IdMezzo = PartenzaSmontanteNuova.CodiceMezzo;
            statoMezzo.Richiesta = command.Richiesta;
            statoMezzo.StatoMezzo = Costanti.MezzoInRientro;
            _upDatePartenza.Update(statoMezzo);

            //GESTIONE NUOVA PARTENZA MONTANTE
            var PartenzaMontanteNuova = new ComposizionePartenze(command.Richiesta, DateTime.UtcNow, command.sostituzione.idOperatore, false, new Partenza()
            {
                Codice = command.Richiesta.Codice.Substring(0, 2) + (_getMaxCodicePartenza.GetMax() + 2).ToString(),
                Mezzo = PartenzaMontante.Partenza.Mezzo,
                Squadre = SquadreSwitch,
                Turno = PartenzaMontante.Partenza.Turno,
                Coordinate = PartenzaMontante.Partenza.Coordinate
            });

            new ArrivoSulPosto(command.Richiesta, PartenzaMontante.CodiceMezzo, DateTime.UtcNow, command.sostituzione.idOperatore, PartenzaMontanteNuova.CodicePartenza);

            AggiornaStatoMezzoCommand statoMezzoMontante = new AggiornaStatoMezzoCommand();
            statoMezzoMontante.CodiciSede = new string[] { PartenzaMontanteNuova.Partenza.Mezzo.Appartenenza };
            statoMezzoMontante.IdMezzo = PartenzaMontanteNuova.CodiceMezzo;
            statoMezzoMontante.Richiesta = command.Richiesta;
            statoMezzoMontante.StatoMezzo = Costanti.MezzoSulPosto;
            _upDatePartenza.Update(statoMezzoMontante);

            #region GESTIONE NOTE

            string NoteSquadreSmontanti = "";
            string NoteSquadreMontanti = "";
            if (PartenzaSmontante.Partenza.Squadre.Count() > 1)
            {
                foreach (var squadra in PartenzaSmontante.Partenza.Squadre)
                {
                    NoteSquadreSmontanti = NoteSquadreSmontanti + squadra.Nome + ",";
                }

                NoteSquadreSmontanti = "Le squadre " + NoteSquadreSmontanti.Substring(0, NoteSquadreSmontanti.Length - 1) + " vengono sostituite ";
            }
            else NoteSquadreSmontanti = "La squadra " + PartenzaSmontante.Partenza.Squadre[0].Nome + " viene sostituita ";

            if (PartenzaMontante.Partenza.Squadre.Count() > 1)
            {
                foreach (var squadra in PartenzaMontante.Partenza.Squadre)
                {
                    NoteSquadreMontanti = NoteSquadreMontanti + squadra + ",";
                }

                NoteSquadreMontanti = " dalle squadre " + NoteSquadreMontanti.Substring(0, NoteSquadreMontanti.Length - 1);
            }
            else NoteSquadreMontanti = " dalla squadra " + PartenzaMontante.Partenza.Squadre[0].Nome;

            string Note = NoteSquadreSmontanti + NoteSquadreMontanti + " sul mezzo " + PartenzaSmontante.CodiceMezzo + " tornando in sede con il mezzo " + PartenzaMontante.CodiceMezzo;

            #endregion GESTIONE NOTE

            new SostituzionePartenzaFineTurno(command.Richiesta, PartenzaSmontante.CodiceMezzo, command.sostituzione.DataOraOperazione, command.sostituzione.idOperatore, Note);

            //TODO finire la where con codici partenze o mezzi
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

            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
