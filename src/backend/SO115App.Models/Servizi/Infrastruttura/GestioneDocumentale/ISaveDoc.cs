using SO115App.Models.Classi.Documentale;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale
{
    public interface ISaveDoc
    {
        void Save(DtoDocumentale pos);
    }
}
