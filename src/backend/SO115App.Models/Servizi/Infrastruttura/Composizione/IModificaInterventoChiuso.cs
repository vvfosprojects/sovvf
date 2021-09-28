using SO115App.Models.Classi.ServiziEsterni.Gac;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface IModificaInterventoChiuso
    {
        void Send(ModificaMovimentoGAC modificamovimento);
    }
}
