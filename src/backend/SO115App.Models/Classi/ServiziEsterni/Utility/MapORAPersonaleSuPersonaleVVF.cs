using SO115App.Models.Classi.ServiziEsterni.Oracle;
using SO115App.Models.Classi.Utenti.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Classi.ServiziEsterni.Utility
{
    public static class MapORAPersonaleSuPersonaleVVF
    {
        public static List<PersonaleVVF> MapLista(List<ORAPersonaleVVF> listaOracle)
        {
            var listaPersonale = new List<PersonaleVVF>();
            foreach (var persona in listaOracle)
            {
                var personaFisica = new PersonaleVVF
                {
                    codiceFiscale = persona.CodFiscale,
                    nome = persona.Nominativo,
                    sede = new DistaccamentoPersonale()
                    {
                        id = persona.Sede
                    }
                };
                listaPersonale.Add(personaFisica);
            }
            return listaPersonale;
        }

        public static PersonaleVVF Map(ORAPersonaleVVF persona)
        {
            return new PersonaleVVF
            {
                codiceFiscale = persona.CodFiscale,
                nome = persona.Nominativo,
                sede = new DistaccamentoPersonale()
                {
                    id = persona.Sede
                }
            };
        }
    }
}
