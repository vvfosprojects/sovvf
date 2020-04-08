using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Utenti;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Turni;

namespace SO115App.FakePersistence.JSon.Turni
{
    public class UpdateTurni : IUpdateTurni
    {
        /// <summary>
        ///   Sovrascrive i turni diurni e notturni con quelli correnti
        /// </summary>
        public void Update(List<Turno> listaTurni)
        {
            var filepath = CostantiJson.Turni;
            var jsonNew = JsonConvert.SerializeObject(listaTurni);
            System.IO.File.WriteAllText(filepath, jsonNew);
        }
    }
}
