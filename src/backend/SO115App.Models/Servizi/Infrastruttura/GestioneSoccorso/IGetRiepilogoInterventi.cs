using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.Filtri;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    public interface IGetRiepilogoInterventi
    {
        Task<List<RichiestaAssistenza>> GetRiepilogoInterventi(FiltriRiepilogoInterventi filtri);
    }
}