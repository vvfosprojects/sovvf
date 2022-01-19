using Newtonsoft.Json;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetModuliColonnaMobileByCodComando : IGetModuliColonnaMobileByCodComando
    {
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetSquadre _getSquadre;
        private readonly IGetMezziUtilizzabili _getMezzi;

        public GetModuliColonnaMobileByCodComando(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, IGetSquadre getSquadre, IGetMezziUtilizzabili getMezzi)
        {
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getSquadre = getSquadre;
            _getMezzi = getMezzi;
        }

        public List<ModuliColonnaMobile> Get(string codSede, string NomeModulo)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();
            pinNodi.Add(new PinNodo(codSede, true));

            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            var arrayCodiciSede = pinNodi.Select(n => n.Codice).ToArray();

            var lstSquadre = new List<Squadra>();

            var lstCodiciProv = arrayCodiciSede.Where(s => s.Contains('.')).Select(s => s.Split('.')[0]).Distinct().ToList();

            lstCodiciProv.ForEach(cod =>
            {
                _getSquadre.GetAllByCodiceDistaccamento(cod).Result.Squadre
                    .Where(s => s.spotType.ToUpper().Equals("MODULE"))
                    .ToList().ForEach(s => lstSquadre.Add(s));
            });

            var lstCodiciMezzi = lstSquadre.SelectMany(s => s.CodiciMezziPreaccoppiati).Distinct();

            var lstMezzi = _getMezzi.GetBySedi(new string[] { codSede }).Result
                .Where(m => lstCodiciMezzi.Contains(m.Codice)).ToList();

            var ModuliDisponibili = lstSquadre
                .Select(s => new ModuliColonnaMobile()
                {
                    Id = s?.Id,
                    CodComando = s?.Distaccamento,
                    Componenti = s?.Membri?.Select(m => new Models.Classi.Composizione.MembroComposizione()
                    {
                        CodiceFiscale = m?.CodiceFiscale,
                        DescrizioneQualifica = m?.qualifications?.FirstOrDefault()?.description,
                        Nominativo = $"{m?.FirstName} {m?.LastName}",
                        Qualifications = m?.qualifications
                    }).ToList(),
                    Mezzi = lstMezzi,
                    Stato = s?.Stato,
                    NomeModulo = string.Join('.', s?.Codice.Split('.').Take(2))
                }).ToList();

            return ModuliDisponibili.Where(c => arrayCodiciSede.Any(s => c.NomeModulo.Equals(NomeModulo))).ToList();
        }
    }
}
