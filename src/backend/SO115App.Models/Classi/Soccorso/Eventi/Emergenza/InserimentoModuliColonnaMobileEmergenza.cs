using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class InserimentoModuliColonnaMobileEmergenza : Evento
    {
        public InserimentoModuliColonnaMobileEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string codSedePresaInCarico) : base(istante, codiceFonte, codice, "InserimentoModuliColonnaMobileEmergenza")
        {
            CodSedePresaInCarico = codSedePresaInCarico;
        }

        public string CodSedePresaInCarico;
    }
}
