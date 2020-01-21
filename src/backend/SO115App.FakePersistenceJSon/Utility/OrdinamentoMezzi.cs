using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Navbar;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class OrdinamentoMezzi
    {
        private readonly IGetRichiestaById _getRichiestaById;

        public OrdinamentoMezzi(IGetRichiestaById getRichiestaById)
        {
            _getRichiestaById = getRichiestaById;
        }

        public decimal GetIndiceOrdinamento(string IdRichiesta, ComposizioneMezzi composizione, string IdRichiestaOrigine = null)
        {
            int ValoreIntOriginePerSganciamento = 0;
            decimal ValoreAdeguatezzaMezzo;

            //var richiestaDestinazione = _getRichiestaById.Get(IdRichiesta);

            if (IdRichiestaOrigine != null)
            {
                var richiestaOrigine = _getRichiestaById.Get(IdRichiestaOrigine);
                //ValoreIntOriginePerSganciamento = GeneraValoreSganciamento(richiestaOrigine.Tipologie);
                ValoreIntOriginePerSganciamento = 50;
            }

            //ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(richiestaDestinazione.Tipologie, composizione.Mezzo.Genere);
            ValoreAdeguatezzaMezzo = 50;

            return (100 / (1 + (Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400))) + ValoreIntOriginePerSganciamento + ValoreAdeguatezzaMezzo;
        }

        private decimal GeneraValoreAdeguatezzaMezzo(List<Tipologia> ListaTipologieDestinazione, string genere)
        {
            decimal ValoreAdeguatezzaMezzo = 0;
            string filepath = "Fake/Navbar.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            Navbar Navbar = JsonConvert.DeserializeObject<Navbar>(json);

            //foreach (Tipologia tipologia in ListaTipologieDestinazione)
            //{
            //    Tipologia tipo = Navbar.Tipologie.Where(x => x.Codice.Equals(tipologia.Codice)).LastOrDefault();

            // if (tipo != null) { switch (genere) { case "APS": ValoreAdeguatezzaMezzo =
            // ValoreAdeguatezzaMezzo + Convert.ToDecimal(tipo.AdeguatezzaMezzo.Aps); break;

            // case "AS": ValoreAdeguatezzaMezzo = ValoreAdeguatezzaMezzo +
            // Convert.ToDecimal(tipo.AdeguatezzaMezzo.As); break;

            // case "AB": ValoreAdeguatezzaMezzo = ValoreAdeguatezzaMezzo +
            // Convert.ToDecimal(tipo.AdeguatezzaMezzo.Ab); break;

            // case "AV": ValoreAdeguatezzaMezzo = ValoreAdeguatezzaMezzo +
            // Convert.ToDecimal(tipo.AdeguatezzaMezzo.Av); break;

            // case "AG": ValoreAdeguatezzaMezzo = ValoreAdeguatezzaMezzo +
            // Convert.ToDecimal(tipo.AdeguatezzaMezzo.Ag); break;

            //            default:
            //                ValoreAdeguatezzaMezzo = ValoreAdeguatezzaMezzo + Convert.ToDecimal(tipo.AdeguatezzaMezzo.Default);
            //                break;
            //        }
            //    }
            //}

            return ValoreAdeguatezzaMezzo;
        }

        private int GeneraValoreSganciamento(List<Tipologia> ListaTipologieOrigine)
        {
            string filepath = CostantiJson.Navbar;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            Navbar Navbar = JsonConvert.DeserializeObject<Navbar>(json);

            int IndiceSganciamento = 0;

            //foreach (Tipologia tipologia in ListaTipologieOrigine)
            //{
            //    Tipologia tipo = Navbar.Tipologie.LastOrDefault(x => x.Codice.Equals(tipologia.Codice));

            //    IndiceSganciamento += tipo.OppSganc;
            //}

            return IndiceSganciamento;
        }
    }
}
