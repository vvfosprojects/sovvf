using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.Utility
{
    class GetTurno : IGetTurno
    {
        private char _letteraTurno;
        private List<Turno> _listaTurniNew;

        public Turno Get(DateTime? data = null)
        {
            var listaTurni = TurniHardCoded.Get();
            var turnoDiurno = listaTurni[0];
            var turnoNotturno = listaTurni[1];
            var numeroTurnoD = int.Parse(turnoDiurno.Codice.Substring(1));
            var numeroTurnoN = int.Parse(turnoNotturno.Codice.Substring(1));
            if (data == null)
            {
                var dataOdierna = DateTime.Now;
                return SceltaCalcolatore(dataOdierna, turnoDiurno, turnoNotturno, numeroTurnoD, numeroTurnoN);
            }
            else
            {
                var dataInput = (DateTime)data;
                return SceltaCalcolatore(dataInput, turnoDiurno, turnoNotturno, numeroTurnoD, numeroTurnoN);
            }
        }
        /// <summary>
        ///   medoto che a seconda della data switcha il calcolatore a seconda si voglia calcolare
        ///   un turno corrente, futuro o passato.
        /// </summary>
        /// <param name="data">la data in input</param>
        /// <param name="turnoD">il turno diurno</param>
        /// <param name="turnoN">il turno notturno</param>
        /// <param name="numeroTurnoD">il numero associato al turno</param>
        /// <param name="numeroTurnoN">il numero associato al turno</param>
        /// <returns>Il turno</returns>
        internal Turno SceltaCalcolatore(DateTime data, Turno turnoD, Turno turnoN, int numeroTurnoD, int numeroTurnoN)
        {
            {
                var giorniTrascorsiDiurni = (int)(data - turnoD.DataOraFine).TotalDays;
                var giorniTrascorsiNotturno = (int)(data - turnoN.DataOraFine).TotalDays;

                if (data > turnoD.DataOraFine)
                {
                    turnoD = CalcolaTurnoCorrente(turnoD, numeroTurnoD, giorniTrascorsiDiurni);
                }
                else
                {
                    turnoD = CalcolaTurnoPassato(turnoD, numeroTurnoD, giorniTrascorsiDiurni);
                }

                if (data > turnoN.DataOraFine)
                {
                    turnoN = CalcolaTurnoCorrente(turnoN, numeroTurnoN, giorniTrascorsiNotturno);
                }
                else
                {
                    turnoN = CalcolaTurnoPassato(turnoN, numeroTurnoN, giorniTrascorsiNotturno);
                }

                return RestituisciDiurnooNotturno(data, turnoD, turnoN);
            }
        }

        /// <summary>
        ///   metodo della classe che accetta il turno e calcola il turno corrente
        /// </summary>
        /// <param name="turnoPassato">turno in input</param>
        /// <param name="numeroTurno">il numero del turno</param>
        /// <param name="giorniTrascorsi">giorni trascorsi dal turno hardcoded di partenza</param>
        /// <returns>Un Turno</returns>
        internal Turno CalcolaTurnoCorrente(Turno turnoPassato, int numeroTurno, int giorniTrascorsi)
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

        /// <summary>
        ///   calcola il turno in passato
        /// </summary>
        /// <param name="turnoInput">il turno in input</param>
        /// <param name="numeroTurno">il numero del turno in input</param>
        /// <param name="giorniTrascorsi">giorni trascorsi calcolati dalla classe</param>
        /// <returns>il turno</returns>
        internal Turno CalcolaTurnoPassato(Turno turnoInput, int numeroTurno, int giorniTrascorsi)
        {
            for (var i = 0; i >= giorniTrascorsi; i--)
            {
                turnoInput.DataOraInizio = turnoInput.DataOraInizio.AddDays(-1);
                turnoInput.DataOraFine = turnoInput.DataOraFine.AddDays(-1);
                switch (turnoInput.Codice.Substring(0, 1))
                {
                    case "A":
                        _letteraTurno = 'D';
                        if (numeroTurno > 1)
                        {
                            numeroTurno--;
                        }
                        else
                        {
                            numeroTurno = 8;
                        }
                        break;

                    case "B":
                        _letteraTurno = 'A';
                        break;

                    case "C":
                        _letteraTurno = 'B';
                        break;

                    case "D":
                        _letteraTurno = 'C';

                        break;
                }

                turnoInput.Codice = _letteraTurno + numeroTurno.ToString();
            }
            return turnoInput;
        }

        /// <summary>
        ///   medoto della classe che calcola se il turno è diurno o notturno
        /// </summary>
        /// <param name="dataOdierna">la data odierna</param>
        /// <param name="turnoDiurno">il turno diurno</param>
        /// <param name="turnoNotturno">il turno notturno</param>
        /// <returns>il Turno</returns>
        internal Turno RestituisciDiurnooNotturno(DateTime dataOdierna, Turno turnoDiurno, Turno turnoNotturno)
        {
            _listaTurniNew = new List<Turno>
                {
                    turnoDiurno,
                    turnoNotturno
                };

            //_updateTurni.Update(_listaTurniNew);

            if (dataOdierna < turnoDiurno.DataOraFine && dataOdierna > turnoDiurno.DataOraInizio)
            {
                return turnoDiurno;
            }

            return turnoNotturno;
        }
    }
}
