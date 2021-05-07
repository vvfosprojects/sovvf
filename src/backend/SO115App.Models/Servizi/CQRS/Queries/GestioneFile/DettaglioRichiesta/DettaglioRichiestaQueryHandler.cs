using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Persistence.File.PDFManagement;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta
{
    public class DettaglioRichiestaQueryHandler : IQueryHandler<DettaglioRichiestaQuery, DettaglioRichiestaResult>
    {
        private readonly IGetRichiesta _getRichiesta;

        public DettaglioRichiestaQueryHandler(IGetRichiesta getRichiesta)
        {
            _getRichiesta = getRichiesta;
        }

        public DettaglioRichiestaResult Handle(DettaglioRichiestaQuery query)
        {
            bool chiamata = query.Codice.Length == 17;

            //GENERO IL FILE
            string filename = chiamata ? "dettaglio_chiamata_" : "dettaglio_intervento";
            filename += query.Codice + ".pdf";

            var managr = new PDFManager(filename);

            string path = managr.Salva();

            //GENERO L'URL DEL FILE
            if (chiamata)
                path += $"{filename}";
            else
                path += $"{filename}";

            return new DettaglioRichiestaResult()
            {
                Data = path
            };
        }
    }
}
