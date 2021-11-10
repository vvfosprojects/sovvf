using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class InserimentoModuliColonnaMobileEmergenzaImmediata : Evento
    {
        public InserimentoModuliColonnaMobileEmergenzaImmediata(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string codSedePresaInCarico) : base(istante, codiceFonte, codice, "InserimentoModuliColonnaMobileEmergenzaImmediata")
        {
            CodSedePresaInCarico = codSedePresaInCarico;
        }

        public string CodSedePresaInCarico;
    }
}
