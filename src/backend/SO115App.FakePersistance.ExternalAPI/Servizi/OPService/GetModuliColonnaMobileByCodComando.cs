using Newtonsoft.Json;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetModuliColonnaMobileByCodComando : IGetModuliColonnaMobileByCodComando
    {
        private readonly string ModuliJsonPath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.ModuliColonnaMobileJson);

        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetModuliColonnaMobileByCodComando(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<ModuliColonnaMobile> Get(string codSede, string NomeModulo)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();
            pinNodi.Add(new PinNodo(codSede, true));

            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            var arrayCodiciSede = pinNodi.Select(n => n.Codice).ToArray();

            string json;
            using (StreamReader r = new StreamReader(ModuliJsonPath))
            {
                json = r.ReadToEnd();
            }

            var ModuliDisponibili = JsonConvert.DeserializeObject<List<ModuliColonnaMobile>>(json);

            return ModuliDisponibili.Where(c => arrayCodiciSede.Any(s => s.Contains(c.CodComando) && c.NomeModulo.Equals(NomeModulo))).ToList();
        }
    }
}
