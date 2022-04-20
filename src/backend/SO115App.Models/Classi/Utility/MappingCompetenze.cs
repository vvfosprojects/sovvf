using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Utility
{
    public static class MappingCompetenze
    {
        public static List<Sede> MapCompetenze(this string[] codUOCompetenza, IGetSedi serviceSedi)
        {
            var listaSedi = new List<Sede>();

            try
            {
                var alberatura = serviceSedi.GetAll();

                int i = 1;

                foreach (var codCompetenza in codUOCompetenza)
                {
                    if (i <= 3)
                    {
                        var Distaccamento = serviceSedi.GetInfoSede(codCompetenza).Result;
                        var info = alberatura.Result.Find(a => a.Codice.Equals(codCompetenza));

                        var sede = Distaccamento.MapSede();

                        if (sede != null)
                        {
                            sede.Descrizione = info.Descrizione;

                            listaSedi.Add(sede);
                        }
                    }

                    i++;
                }
            }
            catch (System.Exception e)
            {
                throw new System.Exception("Errore mapping competenze");
            }

            return listaSedi;
        }
    }
}
