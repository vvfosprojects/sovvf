using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Organigramma;
using Modello.Servizi.Infrastruttura.Organigramma;

namespace SOVVF.FakeImplementations.Modello.Organigramma
{
    internal class GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio : IGetUnitaOperativeVisibiliPerSoccorso
    {
        private readonly IGetUnitaOperativaRadice getUnitaOperativaRadice;

        public GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio(IGetUnitaOperativaRadice getUnitaOperativaRadice)
        {
            this.getUnitaOperativaRadice = getUnitaOperativaRadice;
        }

        public IEnumerable<string> Get()
        {
            return this.getUnitaOperativaRadice.Get()
                .GetSottoAlbero(new TagNodo[] {
                    new TagNodo("DR_LAZ", true)
                })
                .Select(n => n.Codice);
        }
    }
}
