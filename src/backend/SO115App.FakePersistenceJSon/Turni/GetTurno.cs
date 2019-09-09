using Newtonsoft.Json;
using SO115App.API.Models.Classi.Utenti;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.Turni
{
    public class GetTurno : IGetTurno
    {
        private char _letteraTurno;
        private List<Turno> _listaTurniNew;
        private readonly IUpdateTurni _updateTurni;

        public GetTurno(IUpdateTurni updateTurni)
        {
            _updateTurni = updateTurni;
        }

        public Turno Get()
        {
            var filepath = CostantiJson.Turni;
            string json;

            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaTurni = JsonConvert.DeserializeObject<List<Turno>>(json);
            var turnoDiurno = listaTurni[0];
            var turnoNotturno = listaTurni[1];
            var numeroTurnoD = int.Parse(turnoDiurno.Codice.Substring(1));
            var numeroTurnoN = int.Parse(turnoNotturno.Codice.Substring(1));
            var dataOdierna = DateTime.Now;
            var giorniTrascorsiDiurni = (int)(dataOdierna - turnoDiurno.DataOraFine).TotalDays;
            var giorniTrascorsiNotturno = (int)(dataOdierna - turnoNotturno.DataOraFine).TotalDays;

            if (dataOdierna > turnoDiurno.DataOraFine)
            {
                turnoDiurno = CalcolaTurnoCorrente(turnoDiurno, numeroTurnoD, giorniTrascorsiDiurni);
            }

            if (dataOdierna > turnoNotturno.DataOraFine)
            {
                turnoNotturno = CalcolaTurnoCorrente(turnoNotturno, numeroTurnoN, giorniTrascorsiNotturno);
            }

            return RestituisciDiurnooNotturno(dataOdierna, turnoDiurno, turnoNotturno);
        }

        public Turno CalcolaTurnoCorrente(Turno turnoPassato, int numeroTurno, int giorniTrascorsi)
        {
            for (var i = 0; i <= giorniTrascorsi; i++)
            {
                turnoPassato.DataOraInizio = turnoPassato.DataOraInizio.AddDays(1);
                turnoPassato.DataOraFine = turnoPassato.DataOraFine.AddDays(1);
                switch (turnoPassato.Codice.Substring(0, 1))
                {
                    case "A":
                        _letteraTurno = 'B';
                        break;

                    case "B":
                        _letteraTurno = 'C';
                        break;

                    case "C":
                        _letteraTurno = 'D';
                        break;

                    case "D":
                        _letteraTurno = 'A';
                        if (numeroTurno < 8)
                        {
                            numeroTurno++;
                        }
                        else
                        {
                            numeroTurno = 1;
                        }
                        break;
                }

                turnoPassato.Codice = _letteraTurno + numeroTurno.ToString();
            }

            return turnoPassato;
        }

        internal Turno RestituisciDiurnooNotturno(DateTime dataOdierna, Turno turnoDiurno, Turno turnoNotturno)
        {
            _listaTurniNew = new List<Turno>
                {
                    turnoDiurno,
                    turnoNotturno
                };

            _updateTurni.Update(_listaTurniNew);

            if (dataOdierna < turnoDiurno.DataOraFine && dataOdierna > turnoDiurno.DataOraInizio)
            {
                return turnoDiurno;
            }

            return turnoNotturno;
        }
    }
}
