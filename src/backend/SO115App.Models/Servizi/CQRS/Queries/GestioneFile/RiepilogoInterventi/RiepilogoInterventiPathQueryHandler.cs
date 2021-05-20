using CQRS.Queries;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Persistence.File.PDFManagement;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.RiepilogoInterventi
{
    public class RiepilogoInterventiPathQueryHandler : IQueryHandler<RiepilogoInterventiPathQuery, RiepilogoInterventiPathResult>
    {
        private readonly IGetRiepilogoInterventi _getRiepilogoInterventi;
        private readonly IGetUtenteById _getUtente;
        private readonly IPDFTemplateManager<RiepilogoInterventiModelForm> _pdfManager;

        public RiepilogoInterventiPathQueryHandler(IGetRiepilogoInterventi getRiepilogoInterventi,
            IGetUtenteById getUtente,
            IPDFTemplateManager<RiepilogoInterventiModelForm> pdfManager)
        {
            _getUtente = getUtente;
            _getRiepilogoInterventi = getRiepilogoInterventi;
            _pdfManager = pdfManager;
        }

        public RiepilogoInterventiPathResult Handle(RiepilogoInterventiPathQuery query)
        {
            var operatore = _getUtente.GetUtenteByCodice(query.IdOperatore);

            var lstInterventi = _getRiepilogoInterventi.GetRiepilogoInterventi(query.Filtri).Result;

            var filename = "Riepilogo_interventi_" + DateTime.Now.ToString("dd/MM/yyyy") + ".pdf";

            var defString = new string[] { "" };
            var lstRiepiloghi = lstInterventi?.SelectMany(i => i.Eventi.Where(e => e is AbstractPartenza).Select(e => new RiepilogoIntervento()
            {
                Stato = char.Parse(i.TestoStatoRichiesta),
                Data = i.Eventi.OfType<Telefonata>().FirstOrDefault()?.DataOraInserimento ?? DateTime.MinValue,
                Turno = string.Concat(i.lstPartenze.OfType<ComposizionePartenze>().LastOrDefault()?.Partenza?.Squadre?.Select(s => s.Turno ?? "") ?? defString),
                SiglaSquadra = string.Concat(i.lstPartenze.OfType<ComposizionePartenze>().LastOrDefault()?.Partenza?.Squadre?.Select(s => $"{s?.Codice ?? ""}, ") ?? defString),
                //CapoPartenza = string.Concat(i?.lstPartenze.OfType<ComposizionePartenze>().LastOrDefault()?.Partenza?.Squadre.SelectMany(s => s?.Componenti)?.Select(c => $"{c?.CapoPartenza ?? ""}, ")),
                Richiedente = i.Richiedente.Telefono,
                MezzoInUscita = i.lstPartenze.OfType<ComposizionePartenze>().LastOrDefault()?.DataOraInserimento ?? DateTime.MinValue,
                MezzoSulPosto = i.lstPartenze.OfType<ArrivoSulPosto>().LastOrDefault()?.DataOraInserimento,
                MezzoInRientro = i.lstPartenze.OfType<PartenzaInRientro>().LastOrDefault()?.DataOraInserimento,
                MezzoRientrato = i.lstPartenze.OfType<PartenzaRientrata>().LastOrDefault()?.DataOraInserimento,
                Comune = i.Localita.Citta,
                Indirizzo = i.Localita.Indirizzo,
                X = i.Localita.Coordinate.Latitudine,
                Y = i.Localita.Coordinate.Longitudine,
                Tipologie = string.Concat(i.Tipologie.Select(t => t + " ,")).TrimEnd(',').TrimEnd(' '),
                KmCiv = i.Localita.Indirizzo.Split(',')[1].Substring(1, 5),
                NumeroIntervento = int.Parse(i.CodRichiesta.Split('-', StringSplitOptions.RemoveEmptyEntries).Last())
            })).ToList();

            var form = new RiepilogoInterventiModelForm()
            {
                lstRiepiloghi = lstRiepiloghi,
                A = query.Filtri.A,
                Da = query.Filtri.Da,
                DescComando = operatore.Sede.Descrizione,
                TotInterventi = lstInterventi.Count
            };

            var memoryStream = _pdfManager.GenerateAndDownload(form, filename, "RiepiloghiInterventi");

            return new RiepilogoInterventiPathResult()
            {
                Data = memoryStream
            };
        }
    }
}
