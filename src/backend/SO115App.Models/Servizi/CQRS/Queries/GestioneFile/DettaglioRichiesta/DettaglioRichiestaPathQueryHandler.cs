using CQRS.Queries;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Persistence.File.PDFManagement;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta
{
    public class DettaglioRichiestaPathQueryHandler : IQueryHandler<DettaglioRichiestaPathQuery, DettaglioRichiestaPathResult>
    {
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IGetRichiesta _getRichiesta;
        private readonly IGetUtenteById _getUtente;
        private readonly IPDFTemplateManager<DettaglioChiamataModelForm> _dettChiamataManagr;
        private readonly IPDFTemplateManager<DettaglioInterventoModelForm> _dettInterventoManagr;

        public DettaglioRichiestaPathQueryHandler(IGetRichiesta getRichiesta,
            IGetTipologieByCodice getTipologie,
            IGetUtenteById getUtente,
            IPDFTemplateManager<DettaglioChiamataModelForm> dettChiamataManagr,
            IPDFTemplateManager<DettaglioInterventoModelForm> dettInterventoManagr)
        {
            _getUtente = getUtente;
            _getTipologie = getTipologie;
            _getRichiesta = getRichiesta;
            _dettChiamataManagr = dettChiamataManagr;
            _dettInterventoManagr = dettInterventoManagr;
        }

        public DettaglioRichiestaPathResult Handle(DettaglioRichiestaPathQuery query)
        {
            string path;

            var richiesta = _getRichiesta.GetByCodice(query.CodiceRichiesta) ?? _getRichiesta.GetByCodiceRichiesta(query.CodiceRichiesta);
            var operatore = _getUtente.GetUtenteByCodice(query.IdOperatore);

            var chiamata = new DettaglioChiamata()
            {
                Civ_Km = richiesta.Localita.Indirizzo.Split(',')[1],
                Comune = richiesta.Localita.Citta,
                Prov = richiesta.Localita.Provincia,
                DataOraChiamata = richiesta.ListaEventi.OfType<Telefonata>().First().Istante,
                NumeroChiamata = richiesta.Codice,
                Tipologia = string.Concat(_getTipologie.Get(richiesta.Tipologie).Select(t => $"{t.Descrizione}, ")).TrimEnd(',', ' '),
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

            if (string.IsNullOrEmpty(richiesta.CodRichiesta)) // CHIAMATA
            {
                var filename = "dettaglio_chiamata_" + query.CodiceRichiesta + ".pdf";

                var form = new DettaglioChiamataModelForm()
                {
                    Chiamata = chiamata
                };

                _dettChiamataManagr.GenerateDocumentAndSave(form, filename);

                path = _dettChiamataManagr.GetDocumentPath("DettagliChiamate");
            }
            else // INTERVENTO
            {
                var filename = "dettaglio_intervento_" + query.CodiceRichiesta + ".pdf";

                var form = new DettaglioInterventoModelForm()
                {
                    Chiamata = chiamata,
                    lstPartenze = richiesta.lstPartenze.SelectMany(partenza => partenza.Squadre.Select(squadra => new DettaglioPartenza()
                    {
                        SiglaMezzo = partenza.Mezzo.Descrizione,
                        TargaMezzo = partenza.Mezzo.Codice,
                        SiglaSquadra = squadra.Codice,
                        SchedaCapoPartenza = squadra.Componenti.FirstOrDefault(c => c.CapoPartenza)?.Nominativo
                    })).ToList()
                };

                _dettInterventoManagr.GenerateDocumentAndSave(form, filename);

                path = _dettInterventoManagr.GetDocumentPath("DettagliInterventi") + filename;
            }

            return new DettaglioRichiestaPathResult()
            {
                Data = path
            };
        }
    }
}
