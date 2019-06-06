using System;
using System.Collections.Generic;
using SO115App.API.Models.Classi.Soccorso;

namespace SO115App.FakePersistence.InMemory
{
    public class Richieste
    {
        private Dictionary<string, RichiestaAssistenza> richieste = new Dictionary<string, RichiestaAssistenza>();

        public Richieste(IEnumerable<RichiestaAssistenza> richieste)
        {
            foreach (var richiesta in richieste)
                this.richieste.Add(richiesta.Id, richiesta);
        }

        public RichiestaAssistenza GetById(string id)
        {
            return this.richieste[id];
        }
    }
}
