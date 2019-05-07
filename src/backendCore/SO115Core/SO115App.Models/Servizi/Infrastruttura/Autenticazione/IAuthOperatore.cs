using System.Threading.Tasks;
using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.API.Models.Servizi.Infrastruttura.Autenticazione
{
    public interface IAuthOperatore
    {
         Task<Utente> Login(string username, string password);
    }
}