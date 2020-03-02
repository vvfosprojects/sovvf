using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SchedeContatto
{
    public class GetSchedeContattoMarkerFiltered : IGetSchedeContattoMarkerFiltered
    {
        private readonly IGetSchedeContatto _getSchedeContatto;

        public GetSchedeContattoMarkerFiltered(IGetSchedeContatto getSchedeContatto)
        {
            _getSchedeContatto = getSchedeContatto;
        }

        public List<SchedaContattoMarker> Get(AreaMappa area, string codSede)
        {
            var ListaSchede = _getSchedeContatto.ListaSchedeContatto(codSede);

            return GetListaSchedeMarker(area, ListaSchede);
        }

        private List<SchedaContattoMarker> GetListaSchedeMarker(AreaMappa area, List<SchedaContatto> listaSchede)
        {
            var listaSchedeContatto = listaSchede;
            var listaSchedeMarker = new List<SchedaContattoMarker>();
            foreach (var scheda in listaSchedeContatto)
            {
                var schedaMarker = new SchedaContattoMarker
                {
                    CodiceOperatore = scheda.OperatoreChiamata?.CodicePostazioneOperatore ?? "",
                    CodiceScheda = scheda.CodiceScheda,
                    Localita = scheda.Localita,
                    Priorita = scheda.Priorita,
                    Classificazione = scheda.Classificazione,
                    Gestita = scheda.Gestita
                };
                listaSchedeMarker.Add(schedaMarker);
            }
            if (area.FiltroSchedeContatto?.MostraGestite == true)
            {
                return listaSchedeMarker;
            }
            else
            {
                return listaSchedeMarker.FindAll(x => !x.Gestita);
            }
        }
    }
}
