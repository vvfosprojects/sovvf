using SO115App.Persistence.Oracle.Core.Classi;

namespace SO115App.Persistance.Oracle.Core.Interfacce
{
    public interface IDBContext
    {
        Connessione GetConnectionFromCodiceSede(string codSede);
    }
}
