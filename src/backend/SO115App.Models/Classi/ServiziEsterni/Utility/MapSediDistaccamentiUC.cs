using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Composizione;
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
            distaccamento.Id,
            distaccamento.DescDistaccamento,
            distaccamento.Indirizzo,
            distaccamento.Coordinate
        );

        public static Distaccamento MapDistaccamento(this DistaccamentoUC distaccamento) => new Distaccamento()
        {
            Id = distaccamento.Id,
            Cap = distaccamento.Cap,
            CodDistaccamento = int.Parse(distaccamento.Id.Substring(0, 3)),
            CodSede = distaccamento.Id,
            Coordinate = distaccamento.Coordinate,
            DescDistaccamento = distaccamento.Descrizione,
            Indirizzo = distaccamento.Indirizzo,
            CoordinateString = string.IsNullOrEmpty(distaccamento.coordinate) ? distaccamento.coordinate.Split('.') : new string[] { "", "" },
        };

        public static Distaccamento MapDistaccamento(this Sede sede) => new Distaccamento()
        {
            Id = sede.Codice,
            CodSede = sede.Codice,
            Coordinate = sede.Coordinate,
            Indirizzo = sede.Indirizzo,
            DescDistaccamento = sede.Descrizione
        };

        public static DistaccamentoComposizione MapDistaccamentoComposizione(this Sede distaccamento) => new DistaccamentoComposizione()
        {
            Codice = distaccamento.Codice,
            Coordinate = distaccamento.Coordinate,
            Descrizione = distaccamento.Descrizione,
            Indirizzo = distaccamento.Indirizzo,
        };
    }
}
