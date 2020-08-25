using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Classi.Organigramma
{
    public class GerarchiaReader
    {
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private GerarchiaReader() { }
        public GerarchiaReader(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<PinNodo> GetGerarchia(string[] CodiciSedi)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pinNodi = new List<PinNodo>();
            var pinNodiNoDistaccamenti = new List<PinNodo>();

            foreach (var sede in CodiciSedi)
            {
                pinNodi.Add(new PinNodo(sede, true));
                pinNodiNoDistaccamenti.Add(new PinNodo(sede, true));
            }

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            return pinNodi.Distinct().ToList();
        }

        public List<PinNodo> GetGerarchia(string CodiceSede)
        {
            return GetGerarchia(new string[] { CodiceSede });
        }
    }
}
