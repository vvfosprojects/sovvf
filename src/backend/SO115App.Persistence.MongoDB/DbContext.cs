//-----------------------------------------------------------------------
// <copyright file="DbContext.cs" company="CNVVF">
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
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Filtri;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Documentale;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Soccorso.Eventi.Statri;
using SO115App.Models.Classi.Triage;
using SO115App.Persistence.MongoDB.Mappings;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using Evento = SO115App.Models.Classi.NUE.Evento;

[assembly: InternalsVisibleTo("SO115App.CompositionRoot")]

namespace Persistence.MongoDB
{
    public class DbContext
    {
        private readonly IMongoDatabase database;
        private MongoClient _client = new MongoClient();

        public DbContext(string mongoUrl, string databaseName)
        {
            this.database = InitDbInstance(mongoUrl, databaseName);
            InitDbSettings();
            MapClasses();
        }

        private IMongoDatabase InitDbInstance(string mongoUrl, string databaseName)
        {
            var client = new MongoClient(mongoUrl);
            return client.GetDatabase(databaseName);
        }

        private void InitDbSettings()
        {
            var pack = new ConventionPack();
            pack.Add(new CamelCaseElementNameConvention());
            ConventionRegistry.Register("camel case", pack, t => true);
        }

        private void MapClasses()
        {
            EntityMap.Map();
            CodiceMap.Map();
            EventiMap.Map();
            UtenteMap.Map();
            SediMap.Map();
            FiltriMap.Map();
            SchedeNueMap.Map();
            RubricaMap.Map();
            CategorieEntiMap.Map();
            TipologiaDettaglioMap.Map();
            TriageMap.Map();
            TriageDataMap.Map();
            TrasferimentiChiamateMap.Map();
            PosMap.Map();
            DocumentaleMap.Map();

            BsonClassMap.RegisterClassMap<SO115App.Models.Classi.Soccorso.Eventi.TrasferimentoChiamata>();
            BsonClassMap.RegisterClassMap<Telefonata>();
            BsonClassMap.RegisterClassMap<AssegnazionePriorita>();
            BsonClassMap.RegisterClassMap<InizioPresaInCarico>();
            BsonClassMap.RegisterClassMap<AnnullamentoPresaInCarico>();
            BsonClassMap.RegisterClassMap<ComposizionePartenze>();
            BsonClassMap.RegisterClassMap<RevocaPerAltraMotivazione>();
            BsonClassMap.RegisterClassMap<RevocaPerFuoriServizio>();
            BsonClassMap.RegisterClassMap<RevocaPerInterventoNonPiuNecessario>();
            BsonClassMap.RegisterClassMap<RevocaPerRiassegnazione>();
            BsonClassMap.RegisterClassMap<AssegnataRichiesta>();
            BsonClassMap.RegisterClassMap<ArrivoSulPosto>();
            BsonClassMap.RegisterClassMap<UscitaPartenza>();
            BsonClassMap.RegisterClassMap<RichiestaPresidiata>();
            BsonClassMap.RegisterClassMap<RichiestaSospesa>();

            BsonClassMap.RegisterClassMap<RichiestaSoccorsoAereo>();
            BsonClassMap.RegisterClassMap<AnnullamentoRichiestaSoccorsoAereo>();

            BsonClassMap.RegisterClassMap<PartenzaRientrata>();
            BsonClassMap.RegisterClassMap<PartenzaInRientro>();
            BsonClassMap.RegisterClassMap<ChiusuraRichiesta>();
            BsonClassMap.RegisterClassMap<RiaperturaRichiesta>();
            BsonClassMap.RegisterClassMap<AdeguatezzaMezzo>();
            BsonClassMap.RegisterClassMap<Localita>();
            BsonClassMap.RegisterClassMap<Coordinate>();
            BsonClassMap.RegisterClassMap<Distaccamento>();
            BsonClassMap.RegisterClassMap<GeneriMezzi>();
            BsonClassMap.RegisterClassMap<Stati>();
            BsonClassMap.RegisterClassMap<MarcaRilevante>();
            BsonClassMap.RegisterClassMap<InviareFonogramma>();
            BsonClassMap.RegisterClassMap<FonogrammaInviato>();
            BsonClassMap.RegisterClassMap<AllertaSedi>();
            BsonClassMap.RegisterClassMap<RevocaPerSostituzioneMezzo>();
            BsonClassMap.RegisterClassMap<SostituzionePartenzaFineTurno>();
            BsonClassMap.RegisterClassMap<ExternalApiLog>();
            BsonClassMap.RegisterClassMap<InserimentoEnteIntervenuto>();
            BsonClassMap.RegisterClassMap<STATRI_InivioRichiesta>();
            BsonClassMap.RegisterClassMap<Evento>();
            BsonClassMap.RegisterClassMap<InsertSchedaNueRequest>();
            BsonClassMap.RegisterClassMap<Esri_Params>();
        }

        public IMongoCollection<PosDAO> DtoPosCollection
        {
            get
            {
                return database.GetCollection<PosDAO>("pos");
            }
        }

        public IMongoCollection<DaoDocumentale> DocumentaleCollection
        {
            get
            {
                return database.GetCollection<DaoDocumentale>("documentale");
            }
        }

        public IMongoCollection<SO115App.Models.Classi.Condivise.TrasferimentoChiamata> TrasferimentiChiamateCollection
        {
            get
            {
                return database.GetCollection<SO115App.Models.Classi.Condivise.TrasferimentoChiamata>("trasferimentiChiamate");
            }
        }

        public IMongoCollection<CategoriaEnte> CategorieEntiCollection
        {
            get
            {
                return database.GetCollection<CategoriaEnte>("categorieEnti");
            }
        }

        public IMongoCollection<RichiestaAssistenza> RichiestaAssistenzaCollection
        {
            get
            {
                return database.GetCollection<RichiestaAssistenza>("richiesteAssistenza");
            }
        }

        public IMongoCollection<EnteIntervenuto> RubricaCollection
        {
            get
            {
                return database.GetCollection<EnteIntervenuto>("rubrica");
            }
        }

        public IMongoCollection<Tipologia> TipologieCollection
        {
            get
            {
                return database.GetCollection<Tipologia>("tipologie");
            }
        }

        public IMongoCollection<StatoOperativoMezzo> StatoMezzoCollection
        {
            get
            {
                return database.GetCollection<StatoOperativoMezzo>("statoMezzo");
            }
        }

        public IMongoCollection<ChiamateInCorso> ChiamateInCorsoCollection
        {
            get
            {
                return database.GetCollection<ChiamateInCorso>("chiamateInCorso");
            }
        }

        public IMongoCollection<Filtri> FiltriCollection
        {
            get
            {
                return database.GetCollection<Filtri>("filtri");
            }
        }

        public IMongoCollection<SchedaContatto> SchedeContattoCollection
        {
            get
            {
                return database.GetCollection<SchedaContatto>("schedecontatto");
            }
        }

        public IMongoCollection<Utente> UtenteCollection
        {
            get
            {
                return database.GetCollection<Utente>("utente");
            }
        }

        public IMongoCollection<ListaSedi> SediCollection
        {
            get
            {
                return database.GetCollection<ListaSedi>("listasedi");
            }
        }

        public IMongoCollection<StatoOperativoSquadra> StatoSquadraCollection
        {
            get
            {
                return database.GetCollection<StatoOperativoSquadra>("statoSquadra");
            }
        }

        public IMongoCollection<TipologiaDettaglio> TipologiaDettaglioCollection
        {
            get
            {
                return database.GetCollection<TipologiaDettaglio>("tipologiaDettaglio");
            }
        }

        public IMongoCollection<ExternalApiLog> ExternalApiLog
        {
            get
            {
                return database.GetCollection<ExternalApiLog>("externalApiLog");
            }
        }

        public IMongoCollection<Triage> TriageCollection
        {
            get
            {
                return database.GetCollection<Triage>("triage");
            }
        }

        public IMongoCollection<TriageData> TriageDataCollection
        {
            get
            {
                return database.GetCollection<TriageData>("triageData");
            }
        }

        public IMongoCollection<SchedaContattoWSNue> SchedeNueCollection
        {
            get
            {
                return database.GetCollection<SchedaContattoWSNue>("schedeNue");
            }
        }

        public bool DeleteDB(string nomeCollection)
        {
            try
            {
                database.DropCollection(nomeCollection);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
