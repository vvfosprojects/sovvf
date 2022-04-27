//-----------------------------------------------------------------------
// <copyright file="AggiornaStatoMezzoCommandHandler.cs" company="CNVVF">
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
using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaStatoPartenza
{
    public class AnnullaStatoPartenzaCommandHandler : ICommandHandler<AnnullaStatoPartenzaCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly IGetStatoMezzi _getStatoMezzi;

        private readonly ISetStatoOperativoMezzo _setStatoMezzo;
        private readonly ISetStatoSquadra _setStatoSquadra;

        private readonly IMapperRichiestaSuSintesi _mapper;
        private readonly IGetRichiesta _getRichiesta;

        private readonly ISendSTATRIItem _statri;
        private readonly ICheckCongruitaPartenze _check;

        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IModificaInterventoChiuso _modificaGAC;

        public AnnullaStatoPartenzaCommandHandler(IGetRichiesta getRichiesta, IGetTipologieByCodice getTipologie, IUpdateStatoPartenze updateStatoPartenze, IMapperRichiestaSuSintesi mapper,
                                             IGetStatoMezzi getStatoMezzi, ISendSTATRIItem statri, ICheckCongruitaPartenze check,
                                             IModificaInterventoChiuso modificaGAC, ISetStatoOperativoMezzo setStatoMezzo, ISetStatoSquadra setStatoSquadra)
        {
            _getRichiesta = getRichiesta;
            _setStatoMezzo = setStatoMezzo;
            _setStatoSquadra = setStatoSquadra;
            _updateStatoPartenze = updateStatoPartenze;
            _getStatoMezzi = getStatoMezzi;
            _statri = statri;
            _check = check;
            _mapper = mapper;
            _getTipologie = getTipologie;
            _modificaGAC = modificaGAC;
        }

        public void Handle(AnnullaStatoPartenzaCommand command)
        {
            var adesso = DateTime.UtcNow;
            var ultimoMovimento = command.Richiesta.ListaEventi.OfType<AbstractPartenza>().Where(e => e is not AnnullamentoStatoPartenza).Last(p => p.CodicePartenza.Equals(command.CodicePartenza));
            var partenza = command.Richiesta.ListaEventi.OfType<ComposizionePartenze>().Single(p => p.CodicePartenza.Equals(command.CodicePartenza));

            if (adesso >= ultimoMovimento.DataOraInserimento.AddMinutes(1))
                throw new Exception($"Annullamento non più disponibile per il mezzo {command.CodicePartenza}.");

            command.StatoMezzo = _getStatoMezzi.Get(command.CodiciSedi, command.TargaMezzo).First().StatoOperativo;

            if (!new string[] { Costanti.MezzoInViaggio, Costanti.MezzoRientrato }.Contains(command.StatoMezzo))
            {
                string statoPrecedente = null;

                var eventoPrecedente = command.Richiesta.ListaEventi.OfType<AbstractPartenza>()
                    .Where(e => e is not AnnullamentoStatoPartenza)
                    .Where(e => e.CodicePartenza.Equals(partenza.CodicePartenza))
                    .Where(e => e.DataOraInserimento < ultimoMovimento.DataOraInserimento) //TESTARE QUESTA WHERE VENERDI MATTINA
                    .Last();

                switch (eventoPrecedente.TipoEvento)
                {
                    case Costanti.ArrivoSulPosto:
                        statoPrecedente = Costanti.MezzoSulPosto;
                        break;

                    case Costanti.MezzoInRientro:
                        statoPrecedente = Costanti.MezzoInRientro;
                        break;

                    case Costanti.EventoMezzoInRientro:
                        statoPrecedente = Costanti.MezzoInRientro;
                        break;

                    case Costanti.ComposizionePartenza:
                        statoPrecedente = Costanti.MezzoInViaggio;
                        break;
                }

                string note = $"Lo stato {command.StatoMezzo} è stato annullato ed il mezzo {command.TargaMezzo} è tornato nello stato {statoPrecedente}";

                new AnnullamentoStatoPartenza(command.Richiesta, command.TargaMezzo, adesso, command.IdOperatore, Costanti.AnnullamentoStatoPartenza, command.CodicePartenza, note);

                partenza.Partenza.Squadre.ForEach(squadra => squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(statoPrecedente));

                partenza.Partenza.Mezzo.Stato = statoPrecedente;

                command.Richiesta.DeleteEvento(ultimoMovimento);

                #region Chiamata GAC

                var tipologia = _getTipologie.Get(new List<string> { command.Richiesta.Tipologie.Select(t => t.Codice).First() }).First();

                //SEGNALO LA MODIFICA A GAC
                Task.Run(() =>
                {
                    var movimento = new ModificaMovimentoGAC()
                    {
                        targa = command.TargaMezzo.Split('.')[1],
                        autistaRientro = partenza.Partenza.Squadre.First().Membri.FirstOrDefault(m => m.DescrizioneQualifica.Equals("DRIVER"))?.CodiceFiscale,
                        autistaUscita = partenza.Partenza.Squadre.First().Membri.FirstOrDefault(m => m.DescrizioneQualifica.Equals("DRIVER"))?.CodiceFiscale,
                        dataIntervento = command.Richiesta.dataOraInserimento,
                        dataRientro = adesso,
                        dataUscita = command.Richiesta.ListaEventi.OfType<UscitaPartenza>().First(p => p.CodicePartenza.Equals(command.CodicePartenza)).DataOraInserimento,
                        idPartenza = command.CodicePartenza,
                        latitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                        longitudine = command.Richiesta.Localita.Coordinate.Latitudine.ToString(),
                        numeroIntervento = command.Richiesta.CodRichiesta,
                        tipoMezzo = partenza.Partenza.Mezzo.Codice.Split('.')[0],
                        localita = "",
                        comune = new ComuneGAC()
                        {
                            codice = "",
                            descrizione = command.Richiesta.Localita.Citta
                        },
                        provincia = new ProvinciaGAC()
                        {
                            codice = "",
                            descrizione = command.Richiesta.Localita.Provincia
                        },
                        tipoUscita = new TipoUscita()
                        {
                            codice = tipologia.Codice,
                            descrizione = tipologia.Descrizione
                        }
                    };

                    _modificaGAC.Send(movimento);
                });

                #endregion Chiamata GAC

                //AGGIORNO STATO MEZZO E RICHIESTA
                var commandStatoMezzo = new AggiornaStatoMezzoCommand()
                {
                    Richiesta = command.Richiesta,
                    CodiciSede = command.CodiciSedi,
                    Chiamata = command.Chiamata,
                    CodRichiesta = command.CodiceRichiesta,
                    DataOraAggiornamento = adesso,
                    IdMezzo = command.TargaMezzo,
                    IdUtente = command.IdOperatore,
                    StatoMezzo = statoPrecedente,
                    AzioneIntervento = "AnnullamentoPartenza"
                };

                _updateStatoPartenze.Update(commandStatoMezzo);

                command.Richiesta = _getRichiesta.GetByCodice(command.Richiesta.Codice);

                command.Chiamata = _mapper.Map(command.Richiesta);
            }
            else
                throw new Exception("Non è possibile annullare lo stato");
        }
    }
}
