using CQRS.Queries;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Persistence.File.CSVManagement;
using SO115App.Persistence.File.PDFManagement;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.IO;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.RiepilogoInterventi
{
    public class RiepilogoInterventiPathQueryHandler : IQueryHandler<RiepilogoInterventiPathQuery, RiepilogoInterventiPathResult>
    {
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IGetRiepilogoInterventi _getRiepilogoInterventi;
        private readonly IGetUtenteById _getUtente;
        private readonly IPDFTemplateManager<RiepilogoInterventiModelForm> _pdfManager;
        private readonly ICSVTemplateManager<RiepilogoInterventiModelForm> _csvManager;

        public RiepilogoInterventiPathQueryHandler(IGetRiepilogoInterventi getRiepilogoInterventi,
            IGetUtenteById getUtente,
            IGetTipologieByCodice getTipologie,
            IPDFTemplateManager<RiepilogoInterventiModelForm> pdfManager,
            ICSVTemplateManager<RiepilogoInterventiModelForm> csvManager)
        {
            _getUtente = getUtente;
            _getRiepilogoInterventi = getRiepilogoInterventi;
            _pdfManager = pdfManager;
            _getTipologie = getTipologie;
            _csvManager = csvManager;
        }

        public RiepilogoInterventiPathResult Handle(RiepilogoInterventiPathQuery query)
        {
            var lstInterventi = _getRiepilogoInterventi.GetRiepilogoInterventi(query.Filtri);

            var operatore = _getUtente.GetUtenteByCodice(query.IdOperatore);

            var lstTipologie = _getTipologie.Get(lstInterventi.Result.SelectMany(i => i.Tipologie).ToList());

            var filename = "Riepilogo_interventi_" + DateTime.Now.ToString("dd/MM/yyyy") + ".pdf";

            var lstRiepiloghi = lstInterventi.Result?.Select(i => new RiepilogoIntervento()
            {
                Stato = char.Parse(i.TestoStatoRichiesta),
                Data = i.Eventi.OfType<Telefonata>().First().DataOraInserimento,
                Turno = (i.Partenze != null && i.Partenze.Count > 0) ? string.Concat(i?.Partenze?.LastOrDefault()?.Partenza.Squadre.Select(s => s.Turno)) : "",
                Indirizzo = i.Localita?.Indirizzo.Split(',')[0],
                X = "X: " + i.Localita.Coordinate.Latitudine,
                Y = "Y: " + i.Localita.Coordinate.Longitudine,
                Richiedente = i.Richiedente.Nominativo,
                Tipologie = string.Concat(lstTipologie.FindAll(t => i.Tipologie.Any(ct => t.Codice.Equals(ct))).Select(t => t.Descrizione + '.')).TrimEnd(',').TrimEnd(' '),
                NumeroIntervento = i.CodRichiesta != null ? int.Parse(i.CodRichiesta.Split('-', StringSplitOptions.RemoveEmptyEntries).LastOrDefault()) : 0,
                Comune = i?.Localita?.Indirizzo?.Split(',')[2],
                KmCiv = i?.Localita?.Indirizzo?.Split(',')[1],

                Interno = i.Localita.Interno,
                Piano = i.Localita.Piano,
                Scala = i.Localita.Scala,
                CodTipologie = string.Join(',', i?.Tipologie),
                Descrizione = i.Descrizione,
                Telefono = i.Richiedente.Telefono,
                ZonaEmergenza = i?.CodZoneEmergenza?.Count() > 0 ? "true" : "false",


                lstPartenze = i?.Partenze?.Select(p => new RiepilogoPartenza()
                {
                    SiglaSquadra = string.Concat(p.Partenza.Squadre.SelectMany(s => s.Codice + " ")),
                    CodMezzo = p.CodiceMezzo,
                    CapoPartenza = p.Partenza.Squadre.SelectMany(s => s.Membri.Where(m => m.CapoPartenza).Select(m => m.Nominativo)).FirstOrDefault(),
                    MezzoInUscita = p.DataOraInserimento,
                    MezzoSulPosto = i.Eventi.OfType<AbstractPartenza>().Where(pp => pp is ArrivoSulPosto)?.FirstOrDefault(e => e.CodicePartenza.Equals(p.CodicePartenza))?.DataOraInserimento,
                    MezzoInRientro = i.Eventi.OfType<AbstractPartenza>().Where(pp => pp is PartenzaInRientro)?.FirstOrDefault(e => e.CodicePartenza.Equals(p.CodicePartenza))?.DataOraInserimento,
                    MezzoRientrato = i.Eventi.OfType<AbstractPartenza>().Where(pp => pp is PartenzaRientrata)?.FirstOrDefault(e => e.CodicePartenza.Equals(p.CodicePartenza))?.DataOraInserimento,
                    Servizio = "",
                    TpSch = "N " + p.CodicePartenza
                }).ToList()
            }).OrderByDescending(r => r.NumeroIntervento).GroupBy(r => r.Tipologie).SelectMany(r => r).ToList();

            var form = new RiepilogoInterventiModelForm()
            {
                lstRiepiloghi = lstRiepiloghi,
                A = query.Filtri.A,
                Da = query.Filtri.Da,
                DescComando = operatore.Sede.Descrizione,
                TotInterventi = lstInterventi.Result.Count
            };

            MemoryStream memoryStream;
            
            if(query.ContentType == "application/pdf")
                memoryStream = _pdfManager.GenerateAndDownload(form, filename, "RiepiloghiInterventi");
            else
                memoryStream = _csvManager.GenerateAndDownload(form, filename, "RiepiloghiInterventi");

            return new RiepilogoInterventiPathResult()
            {
                Data = memoryStream
            };
        }
    }
}
