using Modello.Classi.Soccorso.Risorse;
using Modello.Classi.Soccorso.Squadre;

namespace Modello.Servizi.GestioneSoccorso
{
    public interface ITestAndSetSelezioneDisponibilitaSquadra
    {
        SelezioneRisorsa Esegui(DisponibilitaSquadra disponibilitaSquadra);
    }
}
