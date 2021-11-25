using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Utility
{
    public class GetSottoSediByCodSede: IGetSottoSediByCodSede
    {
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetSottoSediByCodSede(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<string> Get(string[] codSede)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pinNodi = new List<PinNodo>();

            foreach (var sede in codSede)
                pinNodi.Add(new PinNodo(sede, true));
            
            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            return pinNodi.Select(c => c.Codice).ToList();
        }
    }
}
