using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bogus;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class Mezzo
    {
        private static Random rnd = new Random();
        private static Faker<Mezzo> fakerMezzo = null;
        private static Faker faker = null;

        public Mezzo()
        {
            ContestoMezzo = new ContestoMezzo();
        }

        public static Mezzo CreateMezzoFake(string codiceUnitaOperativa)
        {
            if (fakerMezzo == null)
            {
                fakerMezzo = new Faker<Mezzo>()
                    .StrictMode(true)
                    .RuleFor(m => m.Codice, f => codiceUnitaOperativa + "/APS/" + f.Random.Number(10000, 99999))
                    .RuleFor(m => m.Membri, f => Enumerable.Range(1, 5).Select(n => GeneraCodiceFiscale()).ToArray());
                faker = new Faker();
            }

            return fakerMezzo.Generate();
        }

        public string Codice { get; set; }
        public string[] Membri { get; set; }

        public bool Occupato
        {
            get
            {
                return !this.ContestoMezzo.State.Disponibile;
            }
        }

        public ContestoMezzo ContestoMezzo { get; }

        private static string GeneraCodiceFiscale()
        {
            return faker.Random.Replace("??????##?##?###?");
        }
    }
}
