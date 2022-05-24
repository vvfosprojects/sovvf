using CQRS.Queries;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
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
        private readonly IGetSedi _getSedi;
        private readonly IPDFTemplateManager<RiepilogoInterventiModelForm> _pdfManager;
        private readonly ICSVTemplateManager<RiepilogoInterventiModelForm> _csvManager;

        public RiepilogoInterventiPathQueryHandler(IGetSedi getSedi,
            IGetRiepilogoInterventi getRiepilogoInterventi,
            IGetUtenteById getUtente,
            IGetTipologieByCodice getTipologie,
            IPDFTemplateManager<RiepilogoInterventiModelForm> pdfManager,
            ICSVTemplateManager<RiepilogoInterventiModelForm> csvManager)
        {
            _getSedi = getSedi;
            _getUtente = getUtente;
            _getRiepilogoInterventi = getRiepilogoInterventi;
            _pdfManager = pdfManager;
            _getTipologie = getTipologie;
            _csvManager = csvManager;
        }

        public RiepilogoInterventiPathResult Handle(RiepilogoInterventiPathQuery query)
        {
            var distaccamento = _getSedi.GetAll().Result.Find(s => s.Codice.Equals(query.IdSede.First()));

            var lstInterventi = _getRiepilogoInterventi.GetRiepilogoInterventi(query.Filtri).Result;

            var operatore = _getUtente.GetUtenteByCodice(query.IdOperatore);

            var lstTipologie = _getTipologie.Get();

            var filename = "Riepilogo_interventi_" + DateTime.UtcNow.ToString("dd/MM/yyyy") + ".pdf";

            var lstRiepiloghi = lstInterventi?.Select(i => new RiepilogoIntervento()
            {
                Stato = char.Parse(i.TestoStatoRichiesta),
                Data = i.dataOraInserimento,
                Turno = i.TrnInsChiamata.Substring(0, 1),
                Indirizzo = i.Localita.Indirizzo,
                X = "X: " + i.Localita.Coordinate.Latitudine,
                Y = "Y: " + i.Localita.Coordinate.Longitudine,
                Richiedente = i.Richiedente.Nominativo,
                Tipologie = string.Join(',', lstTipologie.FindAll(t => i.Tipologie.Any(ct => t.Codice.Equals(ct.Codice))).Select(t => t.Descrizione + '.')),
                NumeroIntervento = i.CodRichiesta?.Split('-', StringSplitOptions.RemoveEmptyEntries).LastOrDefault()?.TrimStart('0'),
                Comune = string.IsNullOrEmpty(i.Localita.Citta) ? "non presente" : i.Localita.Citta,
                KmCiv = i.Localita.Civico,
                Interno = i.Localita.Interno,
                Piano = i.Localita.Piano,
                Scala = i.Localita.Scala,
                CodTipologie = string.Join(',', i.Tipologie),
                Descrizione = i.Descrizione,
                Telefono = i.Richiedente.Telefono,
                ZonaEmergenza = i.CodZoneEmergenza?.Length > 0 ? "true" : "false",

                lstPartenze = query.Filtri?.AltriFiltri?.SoloInterventi ?? false ? null : i.Partenze?.Select(p => new RiepilogoPartenza()
                {
                    SiglaSquadra = string.Join(", ", p.Partenza.Squadre.Select(s => $"{s.Codice} ({s.Turno.Substring(0 ,1)})")),
                    CodMezzo = p.CodiceMezzo,
                    CapoPartenza = p.Partenza.Squadre.SelectMany(s => s.Membri.Where(m => m.DescrizioneQualifica.ToUpper().Equals("TEAM_LEADER")).Select(m => m.Nominativo?.ToLower())).FirstOrDefault(),
                    MezzoInUscita = p.DataOraInserimento,
                    MezzoSulPosto = i.Eventi.OfType<AbstractPartenza>().Where(pp => pp is ArrivoSulPosto)?.LastOrDefault(e => e.CodicePartenza.Equals(p.CodicePartenza))?.DataOraInserimento,
                    MezzoInRientro = i.Eventi.OfType<AbstractPartenza>().Where(pp => pp is PartenzaInRientro)?.LastOrDefault(e => e.CodicePartenza.Equals(p.CodicePartenza))?.DataOraInserimento,
                    MezzoRientrato = i.Eventi.OfType<AbstractPartenza>().Where(pp => pp is PartenzaRientrata)?.LastOrDefault(e => e.CodicePartenza.Equals(p.CodicePartenza))?.DataOraInserimento,
                    Servizio = null,
                    TpSch = p.CodicePartenza
                }).ToList()
            }).OrderByDescending(r => r.NumeroIntervento);

            var form = new RiepilogoInterventiModelForm()
            {
                lstRiepiloghi = (query.Filtri?.AltriFiltri?.TipologiaIntervento ?? false) 
                    ? lstRiepiloghi.OrderByDescending(r => r.Tipologie).ToList() 
                    : lstRiepiloghi.ToList(),
                A = query.Filtri.A,
                Da = query.Filtri.Da,
                DescComando = distaccamento.Descrizione,
                TotInterventi = lstInterventi.Count
            };

            MemoryStream memoryStream;

            if (query.ContentType == "application/pdf")
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
