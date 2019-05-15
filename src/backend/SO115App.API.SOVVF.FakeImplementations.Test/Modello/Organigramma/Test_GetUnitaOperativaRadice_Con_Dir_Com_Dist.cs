using System.Linq;
using NUnit.Framework;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;

namespace Tests.Modello.Organigramma
{
    public class Test_GetUnitaOperativaRadice_Con_Dir_Com_Dist
    {
        [Test]
        public void IlComandoDiLeccoHaQuattroDistaccamenti()
        {
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var radice = organigramma.Get();
            var lecco = radice.GetSottoAlbero().Single(uo => uo.Codice == "LC");

            var numeroDistaccamentiLecco = lecco.GetSottoAlbero().Count();

            Assert.That(numeroDistaccamentiLecco, Is.EqualTo(4));
        }

        [Test]
        public void IlComandoDiRomaHaIlDistaccamentoTuscolanoII()
        {
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var radice = organigramma.Get();
            var roma = radice.GetSottoAlbero().Single(uo => uo.Codice == "RM");

            var tuscolanoII = roma.GetSottoAlbero().Single(uo => uo.Codice == "RM.1008");

            Assert.That(tuscolanoII.Codice, Is.EqualTo("RM.1008"));
        }
    }
}