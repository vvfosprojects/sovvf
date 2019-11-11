using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac.Mock
{
    /// <summary>
    ///   Servizio mock scrive la movimentazione del mezzo sul servizio esterno GAC fake.
    /// </summary>
    public class SetMezzo
    {
        private readonly string MezzoJson = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.GacJson);

        /// <summary>
        ///   metodo che scrive la movimentazione sul mock json
        /// </summary>
        /// <param name="codice">il codice del mezzo in movimentaizone</param>
        /// <param name="idRichiesta">il codice della richiesta</param>
        /// <param name="statoOperativo">lo stato operativo del mezzo</param>
        /// <param name="dataMovimentazione">la data di inizio movimentazione</param>
        public void SetMovimentazione(string codice, string idRichiesta, string statoOperativo, DateTime dataMovimentazione)
        {
            string json;

            using (var r = new StreamReader(MezzoJson))
            {
                json = r.ReadToEnd();
            }

            var listaMezzi = JsonConvert.DeserializeObject<List<MezzoDTO>>(json);

            foreach (var mezzo in listaMezzi)
            {
                if (mezzo.Codice.Equals(codice))
                {
                    mezzo.Movimentazione.DataMovimentazione = dataMovimentazione;
                    mezzo.Movimentazione.IdRichiesta = idRichiesta;
                    mezzo.Movimentazione.StatoOperativo = statoOperativo;
                }
            }

            var updatedListaMezzi = JsonConvert.SerializeObject(listaMezzi);
            File.WriteAllText(MezzoJson, updatedListaMezzi);
        }
    }
}
