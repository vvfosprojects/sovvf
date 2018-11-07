using Modello.Classi.Autenticazione;
using Modello.Classi.Condivise;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Fonogramma;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;
using Bogus;
using MongoDB.Driver;
using MongoDB.Bson;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.QueryDTO;
using Modello.Classi.Soccorso;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;
using Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi;

namespace Modello.Servizi.CQRS.Faker
{
    public class GeneraFakerSintesiRichieste
    {

        public static List<SintesiRichiesta> GeneraListaSisntesiRichieste(int NumeroRichiesteDaGenerare)
        {
            List<Evento> Eventi = new List<Evento>();
            List<SintesiRichiesta> ListaSintesi = new List<SintesiRichiesta>();
            Bogus.Faker faker = new Bogus.Faker();
            int i = 0;

            for (i = 0; i <= NumeroRichiesteDaGenerare; i++)
            {
                           
                SintesiRichiesta sintesi = new SintesiRichiesta()
                {
                    id = "R" + i.ToString(),
                    codice = "RM-" + faker.Random.Number(1, 99999),
                    operatore = CercaUtente(),
                    istanteRicezioneRichiesta = DateTime.Now,
                    stato = faker.PickRandomParam("chiamata","assegnata","presidiata","sospesa","chiusa"),
                    priorita = faker.PickRandomParam(Classi.Soccorso.RichiestaAssistenza.Priorita.Alta, Classi.Soccorso.RichiestaAssistenza.Priorita.Bassa, Classi.Soccorso.RichiestaAssistenza.Priorita.Media),
                    tipologie = CercaTipologia(),
                    descrizione = faker.PickRandomParam("Esplosione nei pressi di un centro abitato", "Allagamento", "Incendio"),
                    richiedente = CercaRichiedente(),
                    localita = CercaLocalita(),
                    competenze = CercaCompetenze(),
                    istantePresaInCarico = null,
                    istantePrimaAssegnazione = null,
                    codiceSchedaNue = null,
                    zoneEmergenza = null,
                    partenze = GeneraListaPartenze(),
                    etichette = null
                };
               
                ListaSintesi.Add(sintesi);
            }

            return ListaSintesi;
        }

        private static List<Partenza> GeneraListaPartenze()
        {

            List<ComponenteSquadra> ListaComponentiSquadra = new List<ComponenteSquadra>()
            {
                new ComponenteSquadra("CS","Riccardo Trionfera", "RT", true,false,false),
                new ComponenteSquadra("CS","Davide Cappa", "DC", false,true,false),
                new ComponenteSquadra("CS","Michele Dragonetti", "MD", false,false,false),
            };


            List<Classi.Condivise.Squadra> ListaSquadre = new List<Classi.Condivise.Squadra>()
            {
                new Classi.Condivise.Squadra("SO115",Classi.Condivise.Squadra.StatoSquadra.InViaggio,ListaComponentiSquadra)

            };


            List<Classi.Condivise.Mezzo> ListaMezzi  = new List<Classi.Condivise.Mezzo>()
                {
                    new Classi.Condivise.Mezzo("0", "APS", "Auto pompa serbatoio", "In sede", 0,ListaSquadre)
                };


            Partenza partenza = new Partenza();
            partenza.mezzi = ListaMezzi;
            //partenza.squadre = ListaSquadre;

            List<Partenza> NewPartenza = new List<Partenza>()
            {
                partenza
            };

            return NewPartenza;
        }

        private static Localita CercaLocalita()
        {
            Bogus.Faker faker = new Bogus.Faker();

            Localita NewLocalita = new Localita(
                new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495),
                faker.PickRandomParam("Via Scribonio Curione, 22","Via Cristoforo Colombo 33","Via Nazionale 11", "Via della bufalotta 22", "Via Soldati 55"), 
                faker.PickRandomParam("nei pressi dell'uscita della metro","presso centro abitato","incrocio con fermata autobus", "vicino allo stadio")
            );

            return NewLocalita;
        }

        private static List<Tipologia> CercaTipologia()
        {
            List<Tipologia> NewTipologia = new List<Tipologia>()
            {
                new Tipologia("2","Incendio ed esplosione","fa fa-fire")
            };

            return NewTipologia;
        }

        private static List<Sede> CercaCompetenze()
        {
            Bogus.Faker faker = new Bogus.Faker();

            int numeroFaker = faker.Random.Number(0, 100);

            List<Sede> sede = new List<Sede>()
            {
                new Sede("1", "Tuscolano I","Via Tuscolana 2", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma"),
                new Sede("2", "Tuscolano II","Via Tuscolana 2", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma"),
                new Sede("3", "Ostiense","Via Ostiense 2", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma")
            };

            List<Sede> sede2 = new List<Sede>()
            {
                new Sede("1", "Eur","Viale delle tre fontane 2", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma"),
                new Sede("2", "Torrino", "Via della grande muraglia 2", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma"),
                new Sede("3", "Colombo", "via Leonori 2", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma")
            };

            List<Sede> sede3 = new List<Sede>()
            {
                new Sede("1", "Pisana","Via della Pisana 2", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma"),
                new Sede("2", "Aurelia", "Via Aurelia 44", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma"),
                new Sede("3", "Bufalotta", "Via della Bufalotta 54", new Coordinate(faker.Random.Double() + 41.895, faker.Random.Double() + 12.495), "Distaccamento", null, null,"Lazio","Roma")
            };


            switch (numeroFaker)
            {
                case int n when (n <= 30):
                    return sede;
                    

                case int n when (n > 30 ) && (n <=60 ):
                    return sede2;

                case int n when (n >= 61):
                    return sede3;

                default:
                    return sede;

            }
            
        }

        private static Richiedente CercaRichiedente()
        {
            Bogus.Faker faker = new Bogus.Faker();
            return new Richiedente(faker.Name.FirstName() + faker.Name.LastName(), faker.Phone.PhoneNumber("###.###.####"));

        }

        private static Utente CercaUtente()
        {
           
            Bogus.Faker faker = new Bogus.Faker();

            string Nome = faker.Name.FirstName();
            string Cognome = faker.Name.LastName();

            return new Utente(Nome + Cognome + faker.Random.Number(0,99).ToString(), Nome, Cognome, faker.Random.AlphaNumeric(16));

        }


        public static List<SintesiRichiesta> ElencoSintesiRichiestaMarker()
        {
            return CercaElencoSintesiRichiesta(9999,0);
        }

        public static SintesiRichiesta CercaSintesiRichiestaById(string id)
        {

            var client = new MongoClient();
            var database = client.GetDatabase("SO115");
            var collection = database.GetCollection<SintesiRichiesta>("ElencoSintesiRichieste");
            var sintesi = collection.Find(p => p.id == id).Single(); 

            return (SintesiRichiesta)sintesi;

        }

        public static List<SintesiRichiesta> ElencoSintesiRichiesta(SintesiRichiesteAssistenzaQuery query)
        {
            if(!query.Filtro.RichiestaSingola)
                return CercaElencoSintesiRichiesta(15, Convert.ToInt16(query.Filtro.SearchKey.Substring(1)) + 1);
            else
                return CercaElencoSintesiRichiesta(1, Convert.ToInt16(query.Filtro.SearchKey.Substring(1)));
        }

        protected static List<SintesiRichiesta> CercaElencoSintesiRichiesta(int numOccorrenze, int ultimoIdPaginato)
        {

            var client = new MongoClient();
            var database = client.GetDatabase("SO115");


            //Per richieste direttamente in SINTESI
            //var collection = database.GetCollection<SintesiRichiesta>("ElencoSintesiRichieste");
            //var elenco = collection.Find(FilterDefinition<SintesiRichiesta>.Empty,null).Skip(ultimoIdPaginato).Limit(numOccorrenze).ToList();
            //return elenco;


            //Per richieste 
            var collection = database.GetCollection<ListaRichiesteAssistenza>("RichiesteAssistenza");
            var elenco = collection.Find(FilterDefinition<ListaRichiesteAssistenza>.Empty,null).Skip(ultimoIdPaginato).Limit(numOccorrenze).ToList();


            MapperListaRichiesteSuListaSintesiRichieste mapper = new MapperListaRichiesteSuListaSintesiRichieste();
            
            return mapper.MapRichiesteSuSintesi(elenco);


        }

    }
}
