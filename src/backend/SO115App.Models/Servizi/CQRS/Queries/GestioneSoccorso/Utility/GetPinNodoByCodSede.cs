using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.Utility
{
    public class GetPinNodoByCodSede
    {
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetPinNodoByCodSede(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<PinNodo> GetListaPin(string[] codSedi)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pinNodi = new List<PinNodo>();
            var pinNodiNoDistaccamenti = new List<PinNodo>();

            foreach (var sede in codSedi)
            {
                pinNodi.Add(new PinNodo(sede, true));
                pinNodiNoDistaccamenti.Add(new PinNodo(sede, true));
            }

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            return pinNodi;
        }
    }
}
