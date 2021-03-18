﻿using SO115App.Models.Classi.ServiziEsterni.Oracle;
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
                    CodFiscale = persona.CodFiscale,
                    Nominativo = persona.Nominativo,
                    CodSede = persona.Sede
                };
                listaPersonale.Add(personaFisica);
            }
            return listaPersonale;
        }

        public static PersonaleVVF Map(ORAPersonaleVVF persona)
        {
            return new PersonaleVVF
            {
                CodFiscale = persona.CodFiscale,
                Nominativo = persona.Nominativo,
                CodSede = persona.Sede
            };
        }
    }
}
