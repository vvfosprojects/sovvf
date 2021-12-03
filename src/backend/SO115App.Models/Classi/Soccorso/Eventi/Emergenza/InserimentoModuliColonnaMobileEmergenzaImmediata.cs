using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Emergenza;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class InserimentoModuliColonnaMobileEmergenzaImmediata : Evento
    {
        public InserimentoModuliColonnaMobileEmergenzaImmediata(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string codSedePresaInCarico,
                         List<ModuliColonnaMobile> listaModuliColonnaMobile) : base(istante, codiceFonte, codice, "InserimentoModuliColonnaMobileEmergenzaImmediata")
        {
            CodSedePresaInCarico = codSedePresaInCarico;
            ListaModuliColonnaMobile = listaModuliColonnaMobile;
        }

        public string CodSedePresaInCarico;
        public List<ModuliColonnaMobile> ListaModuliColonnaMobile;
    }
}
