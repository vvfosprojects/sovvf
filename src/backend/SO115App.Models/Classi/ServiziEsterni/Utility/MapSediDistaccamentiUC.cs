using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;

namespace SO115App.Models.Classi.ServiziEsterni.Utility
{
    public static class MapSediDistaccamentiUC
    {
        public static Sede MapSede(this DistaccamentoUC distaccamento) => new Sede
        (
            distaccamento.CodDistaccamento,
            distaccamento.Descrizione,
            distaccamento.Indirizzo,
            distaccamento.Coordinate
        );

        public static Sede MapSede(this Distaccamento distaccamento) => new Sede
        (
            distaccamento.CodDistaccamento.ToString(),
            distaccamento.DescDistaccamento,
            distaccamento.Indirizzo,
            distaccamento.Coordinate
        );

        public static Distaccamento MapDistaccamento(this DistaccamentoUC distaccamento) => new Distaccamento()
        {
            Id = distaccamento.Id,
            Cap = distaccamento.Cap,
            CodDistaccamento = int.Parse(distaccamento.CodDistaccamento.Substring(2)),
            CodSede = distaccamento.CodDistaccamento,
            Coordinate = distaccamento.Coordinate,
            DescDistaccamento = distaccamento.Descrizione,
            Indirizzo = distaccamento.Indirizzo
        };
    }
}
