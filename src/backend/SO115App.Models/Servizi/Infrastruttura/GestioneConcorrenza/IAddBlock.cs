using SO115App.Models.Classi.Concorrenza;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza
{
    public interface IAddBlock
    {
        public void Add(Concorrenza concorrenza);
    }
}
