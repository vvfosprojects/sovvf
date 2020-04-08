using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti
{
    public class GetPersonaleVVF : IGetPersonaleVVF
    {
        private readonly IGetPersonaleByCodSede _getListaPersonale;

        public GetPersonaleVVF(IGetPersonaleByCodSede getListaPersonale)
        {
            _getListaPersonale = getListaPersonale;
        }

        public async Task<List<PersonaleVVF>> Get(string text, string codSede)
        {
            List<PersonaleVVF> ListaPersonale = _getListaPersonale.Get(codSede).Result;

            return ListaPersonale.FindAll(x => x.Nominativo.Contains(text, StringComparison.InvariantCultureIgnoreCase));
        }
    }
}
