using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.GestioneSedi
{
    public class GetAlberaturaUnitaOperative : IGetAlberaturaUnitaOperative
    {
        private readonly IGetDirezioni _getDirezioni;
        private readonly IGetSedi _getSedi;
        public GetAlberaturaUnitaOperative(IGetDirezioni getDirezioni, IGetSedi getSedi)
        {
            _getDirezioni = getDirezioni;
            _getSedi = getSedi;
        }

        public UnitaOperativa ListaSediAlberata()
        {
            //OTTENGO TUTTE LE SEDI, PER OGNI LIVELLO

            var lstRegionali = _getDirezioni.GetDirezioniRegionali();

            var lstProvinciali = _getDirezioni.GetDirezioniProvinciali();

            var lstFigli = new ConcurrentBag<SedeUC>();

            Parallel.ForEach(lstProvinciali.Result, provinciale => _getDirezioni.GetFigliDirezione(provinciale.id).Result.ForEach(figlio => lstFigli.Add(figlio)));

            var con = _getSedi.GetInfoSede("00");

            var conFiglio = _getSedi.GetInfoSede("001");


            //CREO L'ALNERATURA DELLE SEDI

            var result = new UnitaOperativa(con.CodDistaccamento, con.Descrizione);

            result.AddFiglio(new UnitaOperativa(conFiglio.CodDistaccamento, conFiglio.Descrizione));

            foreach (var figlio in result.Figli)
            {

            }

            //var result = new UnitaOperativa();

            return null;
        }
    }
}
