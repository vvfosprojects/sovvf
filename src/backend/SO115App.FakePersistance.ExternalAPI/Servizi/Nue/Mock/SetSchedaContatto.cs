//-----------------------------------------------------------------------
// <copyright file="SetSchedaContatto.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using MongoDB.Driver;
using Newtonsoft.Json;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue.Mock
{
    /// <summary>
    ///   Servizio che mocka tutti i servizi di scrittura sul NUE (Scheda Contatto).
    /// </summary>
    public class SetSchedaContatto
    {
        private readonly string filepath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.NueJson);
        private readonly DbContext _context;
        private readonly IGetSchedeContatto _getSchedeContatto;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;

        public SetSchedaContatto(DbContext context, IGetSchedeContatto getSchedeContatto, IUpDateRichiestaAssistenza upDateRichiestaAssistenza)
        {
            _context = context;
            _getSchedeContatto = getSchedeContatto;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
        }

        /// <summary>
        ///   Metodo che aggiorna la lista delle schede contatto accettanto in firma la lista delle
        ///   schede contatto.
        /// </summary>
        /// <param name="lista">La lista di schede contatto</param>
        public void Set(SchedaContatto scheda, string codiceSchedaModificata)
        {
            var schedaDB = _context.SchedeContattoCollection.Find(Builders<SchedaContatto>.Filter.Eq(s => s.CodiceScheda, codiceSchedaModificata)).SingleOrDefault();

            if (schedaDB != null)
            {
                _context.SchedeContattoCollection.DeleteOne(Builders<SchedaContatto>.Filter.Eq("codiceScheda", scheda.CodiceScheda));
                _context.SchedeContattoCollection.InsertOne(scheda);
            }
        }

        /// <summary>
        ///   Metodo che aggiorna la stato della scheda contatto in gestita e di conseguenza in letta
        /// </summary>
        /// <param name="codiceScheda">il codice della scheda contatto</param>
        /// <param name="codiceSede">il codice sede dell'operatore</param>
        /// <param name="codiceFiscale">il codice fiscale dell'operatore</param>
        /// <param name="gestita">la booleana gestita</param>
        public void SetGestita(string codiceScheda, string codiceSede, string codiceFiscale, bool gestita, string codiceIntervento)
        {
            try
            {
                var schedaContatto = _context.SchedeContattoCollection.Find(x => x.CodiceScheda.Equals(codiceScheda)).SingleOrDefault();
                var intervento = _context.RichiestaAssistenzaCollection.Find(x => x.Codice.Equals(codiceIntervento)).SingleOrDefault();

                if (intervento != null)
                {
                    if (gestita)
                    {
                        intervento.NoteNue = schedaContatto.Dettaglio;
                        var telefonata = intervento.ListaEventi.ToList().Find(e => e is Telefonata);
                        ((Telefonata)telefonata).CodiceSchedaContatto = codiceScheda;
                        _upDateRichiestaAssistenza.UpDate(intervento);
                    }
                    else
                    {
                        intervento.NoteNue = "";
                        var telefonata = intervento.ListaEventi.ToList().Find(e => e is Telefonata);
                        ((Telefonata)telefonata).CodiceSchedaContatto = "";
                        _upDateRichiestaAssistenza.UpDate(intervento);
                    }
                }

                if (schedaContatto.OperatoreChiamata != null)
                {
                    schedaContatto.OperatoreChiamata.CodiceFiscale = codiceFiscale;
                    schedaContatto.OperatoreChiamata.CodiceSede = codiceSede;
                }
                else
                {
                    schedaContatto.OperatoreChiamata = new OperatoreNue();
                    schedaContatto.OperatoreChiamata.CodiceFiscale = codiceFiscale;
                    schedaContatto.OperatoreChiamata.CodiceSede = codiceSede;
                }

                schedaContatto.Gestita = gestita;
                schedaContatto.CodiceInterventoAssociato = codiceIntervento;

                Set(schedaContatto, codiceScheda);
            }
            catch (System.InvalidOperationException e)
            {
                throw new System.Exception("Impossibile aggiornare lo stato della scheda perchè duplicata nel database.");
            }
        }
    }
}
