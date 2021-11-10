using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class InserimentoModuliColonnaMobileEmergenzaPotInt : Evento
    {
        public InserimentoModuliColonnaMobileEmergenzaPotInt(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string codSedePresaInCarico) : base(istante, codiceFonte, codice, "InserimentoModuliColonnaMobileEmergenzaPotInt")
        {
            CodSedePresaInCarico = codSedePresaInCarico;
        }

        public string CodSedePresaInCarico;
    }
}
