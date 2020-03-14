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
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Filtri;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Classi.NUE;
using SO115App.Persistence.MongoDB.Mappings;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("SO115App.CompositionRoot")]

namespace Persistence.MongoDB
{
    public class DbContext
    {
        private readonly IMongoDatabase database;

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
            BsonClassMap.RegisterClassMap<Telefonata>();
            BsonClassMap.RegisterClassMap<AssegnazionePriorita>();
            BsonClassMap.RegisterClassMap<InizioPresaInCarico>();
            BsonClassMap.RegisterClassMap<ComposizionePartenze>();
            BsonClassMap.RegisterClassMap<AssegnataRichiesta>();
            BsonClassMap.RegisterClassMap<ArrivoSulPosto>();
            BsonClassMap.RegisterClassMap<UscitaPartenza>();
            BsonClassMap.RegisterClassMap<RichiestaPresidiata>();
            BsonClassMap.RegisterClassMap<PartenzaRientrata>();
            BsonClassMap.RegisterClassMap<PartenzaInRientro>();
            BsonClassMap.RegisterClassMap<ChiusuraRichiesta>();
            BsonClassMap.RegisterClassMap<RiaperturaRichiesta>();
            BsonClassMap.RegisterClassMap<AdeguatezzaMezzo>();
            BsonClassMap.RegisterClassMap<Localita>();
            BsonClassMap.RegisterClassMap<Coordinate>();
            BsonClassMap.RegisterClassMap<Distaccamenti>();
            BsonClassMap.RegisterClassMap<GeneriMezzi>();
            BsonClassMap.RegisterClassMap<Stati>();
            BsonClassMap.RegisterClassMap<SchedaContatto>();
        }

        public IMongoCollection<RichiestaAssistenza> RichiestaAssistenzaCollection
        {
            get
            {
                return database.GetCollection<RichiestaAssistenza>("richiesteAssistenza");
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
    }
}
