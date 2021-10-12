using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class MappingESRIMessage : IMappingESRIMessage
    {
        public ESRI_RichiestaMessage Map(RichiestaAssistenza richiesta)
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
                    objectId = richiesta.Esri_Param.ObjectId,
                    mongodb_id = richiesta.Id,
                    categoria = richiesta.Tipologie[0],
                    codice = richiesta.CodRichiesta,
                    descrizione = richiesta.Descrizione,
                    stato = richiesta.TestoStatoRichiesta
                }
            };

            return infoESRI;
        }
    }
}
