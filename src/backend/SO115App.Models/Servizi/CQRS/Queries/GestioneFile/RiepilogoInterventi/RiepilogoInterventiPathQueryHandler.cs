using CQRS.Queries;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Persistence.File.PDFManagement;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.RiepilogoInterventi
{
    public class RiepilogoInterventiPathQueryHandler : IQueryHandler<RiepilogoInterventiPathQuery, RiepilogoInterventiPathResult>
    {
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IGetRiepilogoInterventi _getRiepilogoInterventi;
        private readonly IGetUtenteById _getUtente;
        private readonly IPDFTemplateManager<RiepilogoInterventiModelForm> _pdfManager;

        public RiepilogoInterventiPathQueryHandler(IGetRiepilogoInterventi getRiepilogoInterventi,
            IGetUtenteById getUtente,
            IGetTipologieByCodice getTipologie,
            IPDFTemplateManager<RiepilogoInterventiModelForm> pdfManager)
        {
            _getUtente = getUtente;
            _getRiepilogoInterventi = getRiepilogoInterventi;
            _pdfManager = pdfManager;
            _getTipologie = getTipologie;
        }

        public RiepilogoInterventiPathResult Handle(RiepilogoInterventiPathQuery query)
        {
            var lstInterventi = _getRiepilogoInterventi.GetRiepilogoInterventi(query.Filtri);

            var operatore = _getUtente.GetUtenteByCodice(query.IdOperatore);

            var lstTipologie = _getTipologie.Get(lstInterventi.Result.SelectMany(i => i.Tipologie).ToList());

            var filename = "Riepilogo_interventi_" + DateTime.Now.ToString("dd/MM/yyyy") + ".pdf";

            var defString = new string[] { "" };
            var lstRiepiloghi = lstInterventi.Result?
                .SelectMany(i => i.Eventi.OfType<AbstractPartenza>()
                .Select(partenza => new RiepilogoIntervento()
                {
                    Stato = char.Parse(i.TestoStatoRichiesta),
                    Data = i.Eventi.OfType<Telefonata>().First().DataOraInserimento,

                    Turno = string.Concat(i.Partenze.LastOrDefault()?.Partenza.Squadre.Select(s => s.Turno)),
                    SiglaSquadra = string.Concat(i.Partenze.LastOrDefault()?.Partenza.Squadre.Select(s => $"{s.Codice}, ")),
                    CapoPartenza = i.Partenze.FirstOrDefault(p => p.CodicePartenza.Equals(partenza.CodicePartenza))?.Partenza.Squadre.SelectMany(s => s.Componenti).FirstOrDefault(c => c.CapoPartenza)?.Nominativo,
                    Richiedente = i.Richiedente.Telefono,
                    MezzoInUscita = i.Partenze.LastOrDefault().DataOraInserimento,
                    MezzoSulPosto = i.lstPartenze.OfType<ArrivoSulPosto>().LastOrDefault()?.DataOraInserimento,
                    MezzoInRientro = i.lstPartenze.OfType<PartenzaInRientro>().LastOrDefault()?.DataOraInserimento,
                    MezzoRientrato = i.lstPartenze.OfType<PartenzaRientrata>().LastOrDefault()?.DataOraInserimento,
                    Comune = i.Localita.Citta,
                    Indirizzo = i.Localita.Indirizzo,
                    X = i.Localita.Coordinate.Latitudine,
                    Y = i.Localita.Coordinate.Longitudine,
                    Tipologie = string.Concat(lstTipologie.FindAll(t => i.Tipologie.Any(ct => t.Codice.Equals(ct))).Select(t => t.Descrizione + '.')).TrimEnd(',').TrimEnd(' '),
                    KmCiv = i.Localita.Indirizzo.Split(',')[1].Substring(1, 5),
                    NumeroIntervento = int.Parse(i.CodRichiesta.Split('-', StringSplitOptions.RemoveEmptyEntries).Last()),
                    Servizio = "",
                    TpSch = "",
                })).ToList();

            var form = new RiepilogoInterventiModelForm()
            {
                lstRiepiloghi = lstRiepiloghi,
                A = query.Filtri.A,
                Da = query.Filtri.Da,
                DescComando = operatore.Sede.Descrizione,
                TotInterventi = lstInterventi.Result.Count
            };

            var memoryStream = _pdfManager.GenerateAndDownload(form, filename, "RiepiloghiInterventi");

            return new RiepilogoInterventiPathResult()
            {
                Data = memoryStream
            };
        }
    }
}
