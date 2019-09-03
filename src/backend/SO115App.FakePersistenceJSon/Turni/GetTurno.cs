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
        private char _letteraTurnoD;
        private char _letteraTurnoN;
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
            var dataFineDiurno = turnoDiurno.DataOraFine;
            var dataFineNotturno = turnoNotturno.DataOraFine;
            var giorniTrascorsiDiurni = (int)(dataOdierna - dataFineDiurno).TotalDays;
            var giorniTrascorsiNotturno = (int)(dataOdierna - dataFineNotturno).TotalDays;

            if (dataOdierna > dataFineDiurno)
            {
                for (var i = 0; i <= giorniTrascorsiDiurni; i++)
                {
                    turnoDiurno.DataOraInizio = turnoDiurno.DataOraInizio.AddDays(1);
                    turnoDiurno.DataOraFine = turnoDiurno.DataOraFine.AddDays(1);
                    switch (turnoDiurno.Codice.Substring(0, 1))
                    {
                        case "A":
                            _letteraTurnoD = 'B';
                            break;

                        case "B":
                            _letteraTurnoD = 'C';
                            break;

                        case "C":
                            _letteraTurnoD = 'D';
                            break;

                        case "D":
                            _letteraTurnoD = 'A';
                            if (numeroTurnoD <= 8)
                            {
                                numeroTurnoD++;
                            }
                            else
                            {
                                numeroTurnoD = 1;
                            }
                            break;
                    }

                    turnoDiurno.Codice = _letteraTurnoD + numeroTurnoD.ToString();
                    turnoDiurno.DiurnoNotturno = "D";
                }
            }

            if (dataOdierna <= dataFineNotturno)
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

            for (var i = 0; i <= giorniTrascorsiNotturno; i++)
            {
                turnoNotturno.DataOraInizio = turnoNotturno.DataOraInizio.AddDays(1);
                turnoNotturno.DataOraFine = turnoNotturno.DataOraFine.AddDays(1);
                switch (turnoNotturno.Codice.Substring(0, 1))
                {
                    case "A":
                        _letteraTurnoN = 'B';
                        break;

                    case "B":
                        _letteraTurnoN = 'C';
                        break;

                    case "C":
                        _letteraTurnoN = 'D';
                        break;

                    case "D":
                        _letteraTurnoN = 'A';
                        if (numeroTurnoN <= 8)
                        {
                            numeroTurnoN++;
                        }
                        else
                        {
                            numeroTurnoN = 1;
                        }
                        break;
                }

                turnoNotturno.Codice = _letteraTurnoN + numeroTurnoN.ToString();
                turnoNotturno.DiurnoNotturno = "N";

                _listaTurniNew = new List<Turno>
                {
                    turnoDiurno,
                    turnoNotturno
                };
                _updateTurni.Update(_listaTurniNew);
            }

            if (dataOdierna < turnoDiurno.DataOraFine && dataOdierna > turnoDiurno.DataOraInizio)
            {
                return turnoDiurno;
            }

            return turnoNotturno;
        }
    }
}
