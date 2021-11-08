using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneLog
{
    public interface IWriteLog
    {
        public void Save(ExternalApiLog exception);
    }
}
