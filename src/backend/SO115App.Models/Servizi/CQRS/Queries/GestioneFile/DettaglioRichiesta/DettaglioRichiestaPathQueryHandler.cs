using CQRS.Queries;
using Serilog;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Persistence.File.CSVManagement;
using SO115App.Persistence.File.PDFManagement;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System.IO;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta
{
    public class DettaglioRichiestaPathQueryHandler : IQueryHandler<DettaglioRichiestaPathQuery, DettaglioRichiestaPathResult>
    {
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IGetRichiesta _getRichiesta;
        private readonly IGetUtenteById _getUtente;
        private readonly IPDFTemplateManager<DettaglioChiamataModelForm> _PDFdettChiamataManager;
        private readonly IPDFTemplateManager<DettaglioInterventoModelForm> _PDFdettInterventoManager;
        private readonly ICSVTemplateManager<DettaglioChiamataModelForm> _CSVdettChiamataManager;
        private readonly ICSVTemplateManager<DettaglioInterventoModelForm> _CSVdettInterventoManager;

        public DettaglioRichiestaPathQueryHandler(IGetRichiesta getRichiesta,
            IGetTipologieByCodice getTipologie,
            IGetUtenteById getUtente,
            IPDFTemplateManager<DettaglioChiamataModelForm> dettChiamataManager,
            IPDFTemplateManager<DettaglioInterventoModelForm> dettInterventoManager,
            ICSVTemplateManager<DettaglioChiamataModelForm> CSVdettChiamataManager,
            ICSVTemplateManager<DettaglioInterventoModelForm> CSVdettInterventoManager)
        {
            _getUtente = getUtente;
            _getTipologie = getTipologie;
            _getRichiesta = getRichiesta;
            _PDFdettChiamataManager = dettChiamataManager;
            _PDFdettInterventoManager = dettInterventoManager;
            _CSVdettChiamataManager = CSVdettChiamataManager;
            _CSVdettInterventoManager = CSVdettInterventoManager;
        }

        public DettaglioRichiestaPathResult Handle(DettaglioRichiestaPathQuery query)
        {
            MemoryStream stream;

            Log.Error($"Dettaglio QH - 1 **************** INIZIO ************************");
            var richiesta = _getRichiesta.GetByCodice(query.CodiceRichiesta) ?? _getRichiesta.GetByCodiceRichiesta(query.CodiceRichiesta);
            var operatore = _getUtente.GetUtenteByCodice(query.IdOperatore);

            var chiamata = new DettaglioChiamata()
            {
                //Civ_Km = richiesta.Localita.Indirizzo.Split(',')[1],
                Comune = richiesta.Localita.Citta,
                Prov = richiesta.Localita.Provincia,
                DataOraChiamata = richiesta.ListaEventi.OfType<Telefonata>().First().Istante,
                NumeroChiamata = richiesta.Codice,
                Tipologia = string.Concat(_getTipologie.Get(richiesta.Tipologie.Select(c => c.Codice).ToList()).Select(t => $"{t.Descrizione}, ")).TrimEnd(',', ' '),
                Richiedente = richiesta.Richiedente.Nominativo,
                RichiedenteTelefono = richiesta.Richiedente.Telefono,
                Dettaglio = richiesta.DettaglioTipologia?.Descrizione,
                NoteChiamata = richiesta.NotePubbliche,
                Interno = richiesta.Localita.Interno,
                Palazzo = richiesta.Localita.Palazzo,
                Operatore = $"{operatore.Nome} {operatore.Cognome}",
                Piano = richiesta.Localita.Piano,
                Scala = richiesta.Localita.Scala,
                TitoloDistaccamento = richiesta.Competenze.First().Descrizione
            };

            Log.Error($"Dettaglio QH - 1 **************** CHIAMATA ************************");
            if (string.IsNullOrEmpty(richiesta.CodRichiesta)) // CHIAMATA
            {
                var filename = "dettaglio_chiamata_" + query.CodiceRichiesta + ".pdf";

                var form = new DettaglioChiamataModelForm()
                {
                    Chiamata = chiamata
                };

                if (query.ContentType == "application/pdf")
                    stream = _PDFdettChiamataManager.GenerateAndDownload(form, filename, "DettagliChiamate");
                else
                    stream = _CSVdettChiamataManager.GenerateAndDownload(form, filename, "DettagliChiamate");
            }
            else // INTERVENTO
            {
                var filename = "dettaglio_intervento_" + query.CodiceRichiesta + ".pdf";

                var form = new DettaglioInterventoModelForm()
                {
                    Chiamata = chiamata,
                    lstPartenze = richiesta.lstPartenze?.SelectMany(partenza => partenza.Squadre.Select(squadra => new DettaglioPartenza()
                    {
                        SiglaMezzo = partenza.Mezzo.Descrizione,
                        TargaMezzo = partenza.Mezzo.Codice,
                        SiglaSquadra = squadra.Codice,
                        //SchedaCapoPartenza = squadra.Membri?.FirstOrDefault(c => c.CapoPartenza)?.Nominativo,
                        //OraAss = DateTime.Now
                    })).ToList()
                };

                Log.Error($"Dettaglio QH - 1 **************** CHIAMATA GenerateAndDownload ************************");

                if (query.ContentType == "application/pdf")
                    stream = _PDFdettInterventoManager.GenerateAndDownload(form, filename, "DettagliInterventi");
                else
                    stream = _CSVdettInterventoManager.GenerateAndDownload(form, filename, "DettagliInterventi");
            }

            return new DettaglioRichiestaPathResult()
            {
                Data = stream
            };
        }
    }
}
