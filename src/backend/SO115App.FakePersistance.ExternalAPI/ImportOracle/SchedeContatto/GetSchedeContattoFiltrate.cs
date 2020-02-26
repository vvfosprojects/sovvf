using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SchedeContatto
{
    public class GetSchedeContattoFiltrate : IGetSchedeFiltrate
    {
        private readonly IGetSchedeContatto _getSchedeContatto;

        public GetSchedeContattoFiltrate(IGetSchedeContatto getSchedeContatto)
        {
            _getSchedeContatto = getSchedeContatto;
        }

        public List<SchedaContatto> Get(string text, bool? gestita, string codiceFiscale, double? rangeOre, string codSede)
        {
            var ListaSchede = _getSchedeContatto.ListaSchedeContatto(codSede);

            return GetListaFiltrata(text, gestita, codiceFiscale, rangeOre, ListaSchede);
        }

        private List<SchedaContatto> GetListaFiltrata(string text, bool? gestita, string codiceFiscale, double? rangeOre, List<SchedaContatto> listaSchede)
        {
            var listaSchedeFiltrate = listaSchede;
            if (!string.IsNullOrWhiteSpace(text)) listaSchedeFiltrate = GetSchedeContattoFromText(text, listaSchede);
            if (!string.IsNullOrWhiteSpace(codiceFiscale)) listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.OperatoreChiamata.CodiceFiscale.Equals(codiceFiscale));
            if (gestita.HasValue) listaSchedeFiltrate = listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.Gestita.Equals(gestita));
            if (rangeOre.HasValue)
            {
                var dataCorrente = DateTime.UtcNow.AddHours(-(double)rangeOre);
                listaSchedeFiltrate = listaSchedeFiltrate.FindAll(x => x.DataInserimento >= dataCorrente);
            }

            return listaSchedeFiltrate;
        }

        public List<SchedaContatto> GetSchedeContattoFromText(string testolibero, List<SchedaContatto> listaSchedeOra)
        {
            var listaSchede = listaSchedeOra;

            return (from schedaContatto in listaSchede let schedacontattoJson = JsonConvert.SerializeObject(schedaContatto) where schedacontattoJson.Contains(testolibero, StringComparison.CurrentCultureIgnoreCase) select schedaContatto).ToList();
        }
    }
}
