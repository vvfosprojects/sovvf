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

        public List<PinNodo> GetGerarchiaFull(string[] CodiciSedi)
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

        public List<PinNodo> GetGerarchiaFull(string CodiceSede)
        {
            return GetGerarchiaFull(new string[] { CodiceSede });
        }

        public List<string> GetGerarchiaSede(string codSedeDiPartenza, string[] CodSediAllertate = null)
        {
            var listaSediAlberata = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pin = new PinNodo(codSedeDiPartenza);
            var pinNodi = new List<PinNodo>();
            pinNodi.Add(pin);

            var UnitaOperativaAnagrafica = listaSediAlberata.GetSottoAlbero(pinNodi);

            List<string> ListaCodiciSediInteressate = new List<string>();

            UnitaOperativa unitaperativa = new UnitaOperativa(codSedeDiPartenza, UnitaOperativaAnagrafica.ToList()[0].Nome)
            {
                Figli = UnitaOperativaAnagrafica.ToList()[0].Figli
            };

            foreach (var direzioneRegionale in listaSediAlberata.Figli)
            {
                if (direzioneRegionale.Figli.ToList().Contains(unitaperativa))
                {
                    ListaCodiciSediInteressate.Add(direzioneRegionale.Codice);
                    ListaCodiciSediInteressate.Add(unitaperativa.Codice);
                }
                else
                {
                    foreach (var comune in direzioneRegionale.Figli)
                    {
                        if (comune.Figli.ToList().Contains(unitaperativa))
                        {
                            ListaCodiciSediInteressate.Add(direzioneRegionale.Codice);
                            ListaCodiciSediInteressate.Add(comune.Codice);
                            ListaCodiciSediInteressate.Add(unitaperativa.Codice);
                        }
                    }
                }
            }

            if (CodSediAllertate != null)
            {
                foreach (var sede in CodSediAllertate)
                {
                    ListaCodiciSediInteressate.Add(sede);
                }
            }

            return ListaCodiciSediInteressate;
        }
    }
}
