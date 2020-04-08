using SO115App.API.Models.Classi.Utenti;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.Utility
{
    public static class TurniHardCoded
    {
        public static List<Turno> Get()
        {
            var listaTurni = new List<Turno>();

            var turnoDiurno = new Turno
            {
                Codice = "C7",
                DiurnoNotturno = "D",
                DataOraInizio = new DateTime(2020, 01, 22, 8, 0, 0),
                DataOraFine = new DateTime(2020, 01, 22, 20, 0, 0)
            };

            var turnoNotturno = new Turno
            {
                Codice = "B7",
                DiurnoNotturno = "N",
                DataOraInizio = new DateTime(2020, 01, 22, 20, 0, 0),
                DataOraFine = new DateTime(2020, 01, 23, 8, 0, 0)
            };

            listaTurni.Add(turnoDiurno);
            listaTurni.Add(turnoNotturno);
            return listaTurni;
        }
    }
}
