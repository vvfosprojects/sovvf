using SO115App.Models.Classi.ServiziEsterni.OPService;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface IGetComposizioneSquadreDB
    {
        WorkShift Get();
        //WorkShift GetByCodiceSede(string codiceSede);
    }
}
