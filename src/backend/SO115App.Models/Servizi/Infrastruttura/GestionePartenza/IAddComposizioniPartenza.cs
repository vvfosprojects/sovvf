using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;

namespace SO115App.Models.Servizi.Infrastruttura.GestionePartenza
{
    public interface IAddComposizioniPartenza
    {
        void AddOrUpdate(ComposizionePartenze composizionePartenza);
    }
}
