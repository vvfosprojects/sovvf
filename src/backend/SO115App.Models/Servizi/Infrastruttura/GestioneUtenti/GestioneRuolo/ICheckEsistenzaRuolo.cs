using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo
{
    public interface ICheckEsistenzaRuolo
    {
        bool Check(List<Role> ruoliDaAggiungere, string codiceFiscaleUtenteDaControllare);
    }
}
