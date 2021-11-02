using SO115App.Models.Classi.Emergenza;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza
{
    public interface IGetEmergenzaById
    {
        Emergenza Get(string Id);
    }
}
