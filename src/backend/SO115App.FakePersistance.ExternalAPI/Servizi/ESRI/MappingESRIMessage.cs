using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class MappingESRIMessage : IMappingESRIMessage
    {
        public ESRI_RichiestaMessage Map(SintesiRichiesta richiesta)
        {
            if (richiesta.Esri_Param == null)
            {
                var infoESRI = new ESRI_RichiestaMessage()
                {
                    geometry = new geometry()
                    {
                        x = richiesta.Localita.Coordinate.Longitudine,
                        y = richiesta.Localita.Coordinate.Latitudine
                    },
                    attributes = new attributes()
                    {
                        mongodb_id = richiesta.Id,
                        categoria = richiesta.Tipologie[0].Categoria,
                        codice = richiesta.Codice,
                        descrizione = richiesta.Descrizione,
                        stato = richiesta.Stato
                    }
                };

                return infoESRI;
            }
            else
            {
                var infoESRI = new ESRI_RichiestaMessage()
                {
                    geometry = new geometry()
                    {
                        x = richiesta.Localita.Coordinate.Longitudine,
                        y = richiesta.Localita.Coordinate.Latitudine
                    },
                    attributes = new attributes()
                    {
                        objectid = richiesta.Esri_Param.ObjectId,
                        mongodb_id = richiesta.Id,
                        categoria = richiesta.Tipologie[0].Categoria,
                        codice = richiesta.CodiceRichiesta != null ? richiesta.CodiceRichiesta : richiesta.Codice,
                        descrizione = richiesta.Descrizione,
                        stato = richiesta.Stato
                    }
                };

                return infoESRI;
            }
        }
    }
}
