using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.SignalR.Utility
{
    public class GetGerarchiaToSend
    {
        private readonly IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative;

        public GetGerarchiaToSend(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            this.getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<string> Get(string codSedeDiPartenza, string[] CodSediAllertate = null)
        {
            var listaSediAlberata = getAlberaturaUnitaOperative.ListaSediAlberata();
            var pin = new PinNodo(codSedeDiPartenza);
            var pinNodi = new List<PinNodo>();
            pinNodi.Add(pin);
            var UnitaOperativaAnagrafica = listaSediAlberata.Result.GetSottoAlbero(pinNodi);
            List<string> ListaCodiciSediInteressate = new List<string>();

            UnitaOperativa unitaperativa = new UnitaOperativa(codSedeDiPartenza, UnitaOperativaAnagrafica.ToList()[0].Nome)
            {
                Figli = UnitaOperativaAnagrafica.ToList()[0].Figli
            };

            foreach (var direzioneRegionale in listaSediAlberata.Result.Figli.First().Figli)
            {
                if (direzioneRegionale.Equals(unitaperativa))
                {
                    ListaCodiciSediInteressate.Add(direzioneRegionale.Codice);
                    ListaCodiciSediInteressate.Add(unitaperativa.Codice);
                    foreach (var comune in direzioneRegionale.Figli)
                        ListaCodiciSediInteressate.Add(comune.Codice);                       
                    
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

            return ListaCodiciSediInteressate.Distinct().ToList();
        }
    }
}
