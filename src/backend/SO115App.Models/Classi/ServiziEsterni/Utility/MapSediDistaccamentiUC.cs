using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using System.Linq;

namespace SO115App.Models.Classi.ServiziEsterni.Utility
{
    public static class MapSediDistaccamentiUC
    {
        public static Sede MapSede(this DistaccamentoUC distaccamento) => new Sede
        (
            distaccamento.Id,
            distaccamento.Descrizione,
            distaccamento.Indirizzo,
            distaccamento.Coordinate
        )
        {
            CoordinateString = !string.IsNullOrEmpty(distaccamento.coordinate) && distaccamento.coordinate.Contains(',') ? distaccamento.coordinate.Split(',') : new string[] { "", "" }
        };

        public static Sede MapSede(this Distaccamento distaccamento) => new Sede
        (
            distaccamento.Id,
            distaccamento.Nome,
            distaccamento.Indirizzo,
            distaccamento.Coordinate
        )
        {
            CoordinateString = distaccamento.CoordinateString
        };

        public static Distaccamento MapDistaccamento(this DistaccamentoUC distaccamento)
        {
            int res;
            return new Distaccamento()
            {
                Id = distaccamento.Id,
                Cap = distaccamento.Cap,
                CodDistaccamento = int.TryParse(distaccamento.Id.Split('.').Last(),out res) ? int.Parse(distaccamento.Id.Split('.').Last()) : int.Parse(distaccamento.Id.Split('.').First()),
                CodSede = distaccamento.Id,
                Coordinate = distaccamento.Coordinate,
                DescDistaccamento = distaccamento.Descrizione,
                Indirizzo = distaccamento.Indirizzo,
                CoordinateString = !string.IsNullOrEmpty(distaccamento.coordinate) && distaccamento.coordinate.Contains(',') ? distaccamento.coordinate.Split(',') : new string[] { "", "" }
            };
        }
        public static Distaccamento MapDistaccamento(this Sede sede) => new Distaccamento()
        {
            Id = sede.Codice,
            CodSede = sede.Codice,
            Coordinate = sede.Coordinate,
            Indirizzo = sede.Indirizzo,
            CoordinateString = sede.CoordinateString,
            DescDistaccamento = sede.Descrizione
        };

        public static DistaccamentoComposizione MapDistaccamentoComposizione(this Sede distaccamento) => new DistaccamentoComposizione()
        {
            Codice = distaccamento.Codice,
            Coordinate = distaccamento.Coordinate,
            Descrizione = distaccamento.Descrizione,
            Indirizzo = distaccamento.Indirizzo,
            Sigla = distaccamento.sigla
        };
    }
}
