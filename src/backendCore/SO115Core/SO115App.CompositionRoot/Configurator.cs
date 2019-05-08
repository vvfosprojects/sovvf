using SimpleInjector;
using SO115App.API.Models.Classi.Utenti.Autenticazione;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni;
using System.Reflection;

namespace SO115App.CompositionRoot
{
    public static class Configurator
    {
        public static void Bind(Container container)
        {
            var assemblies = new Assembly[]
            {
                typeof(API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes.BoxMezziQuery).Assembly
            };

            // The following two lines perform the batch registration by using the great generics
            // support provided by SimpleInjector.
            container.Register(typeof(CQRS.Commands.ICommandHandler<>), assemblies);
            container.Register(typeof(CQRS.Queries.IQueryHandler<,>), assemblies);

            //The following line performs the batch registration of the command notifiers
            container.Collection.Register(typeof(CQRS.Commands.Notifiers.ICommandNotifier<>), assemblies);
            container.RegisterDecorator(
                typeof(CQRS.Commands.ICommandHandler<>),
                typeof(CQRS.Commands.Notifiers.NotifyingCommandHandlerDecorator<>));

            //The following two lines perform the batch registration of the command authorizers
            container.Collection.Register(typeof(CQRS.Commands.Authorizers.ICommandAuthorizer<>), assemblies);
            container.RegisterDecorator(
                typeof(CQRS.Commands.ICommandHandler<>),
                typeof(CQRS.Commands.Authorizers.AuthorizingCommandHandlerDecorator<>));

            //The following two lines perform the batch registration of the query authorizers
            container.Collection.Register(typeof(CQRS.Queries.Authorizers.IQueryAuthorizer<,>), assemblies);
            container.RegisterDecorator(
                typeof(CQRS.Queries.IQueryHandler<,>),
                typeof(CQRS.Queries.Authorizers.AuthorizingQueryHandlerDecorator<,>));

            //The following two lines perform the batch registration of the command validators
            container.Collection.Register(typeof(CQRS.Commands.Validators.ICommandValidator<>), assemblies);
            container.RegisterDecorator(
                typeof(CQRS.Commands.ICommandHandler<>),
                typeof(CQRS.Commands.Validators.ValidatingCommandHandlerDecorator<>));

            //The following two lines perform the batch registration of the query validators
            container.Collection.Register(typeof(CQRS.Queries.Validators.IQueryValidator<,>), assemblies);
            container.RegisterDecorator(
                typeof(CQRS.Queries.IQueryHandler<,>),
                typeof(CQRS.Queries.Validators.ValidatingQueryHandlerDecorator<,>));

            container.RegisterDecorator(
                typeof(CQRS.Queries.IQueryHandler<,>),
                typeof(Logging.CQRS.QueryHandlerLogDecorator<,>));

            container.RegisterDecorator(
                typeof(CQRS.Commands.ICommandHandler<>),
                typeof(Logging.CQRS.CommandHandlerLogDecorator<>));

            container.Register(typeof(IAuthOperatore), typeof(AuthOperatore));
            container.Register<IGetUnitaOperativaPerCodice, GetUnitaOperativaPerCodice>();

            //TEST AND FAKE
            //************************************************************************************************************************
            //c.Register<IGeneratoreRichieste, GeneratoreRichieste>();
            //c.RegisterInstance<IGeneratoreRichieste>(new GeneratoreRichieste());
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.Autenticazione.IGetOperatoreAutenticato, SO115App.API.SOVVF.FakeImplementations.Modello.Autenticazione.GetOperatoreAutenticato>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.Organigramma.IGetUnitaOperativaRadice, SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma.GetUnitaOperativaRadice_OrganigrammaCONRidottoCablato>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.Organigramma.IGetUnitaOperativeVisibiliPerSoccorso, SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma.GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetSituazioneMezzi, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi.GetSituazioneMezzi_RandomFake>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.Anagrafiche.IGetTipoInterventoByCodice, SO115App.API.SOVVF.FakeImplementations.Modello.Infrastruttura.Anagrafiche.GetTipoInterventoByCodice_Fake>();
            container.Register<SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO.ITestAndSetSelezioneDisponibilitaSquadra, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetSelezioneDisponibilitaSquadra_Fake>();
            container.Register<SO115App.API.Models.Classi.Soccorso.Risorse.ITestAndSetSelezioneDisponibilitaMezzo, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetSelezioneDisponibilitaMezzo_Fake>();
            container.Register<SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra.CommandDTO.ITestAndSetDeselezioneDisponibilitaSquadra, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetDeselezioneDisponibilitaSquadra_DoNothing>();
            container.Register<SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO.ITestAndSetDeselezioneDisponibilitaMezzo, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetDeselezioneDisponibilitaMezzo_DoNothing>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.ISaveRichiestaAssistenza, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.SaveRichiestaDiAssistenza_Fake>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.IGetRichiestaAssistenzaById, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GetRichiestaAssistenzaById_Fake>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza.ICercaRichiesteAssistenza, SO115App.API.Models.Classi.Soccorso.CercaRichiesteAssistenza_Empty>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetNumeroMezziSoccorsoOraInServizio, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi.GetNumeroMezziSoccorsoOraInServizio_Fake>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.IGetNumeroSquadreSoccorsoOraInServizio, SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi.GetNumeroSquadreSoccorsoOraInServizio_Fake>();
            container.Register<SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.CompetenzeTerritoriali.IGetCompetenzeByPunto, SO115App.API.SOVVF.FakeImplementations.Modello.Infrastruttura.CompetenzeTerritoriali.GetCompetenzeByPunto_Fake_Hardcoded>();
            ////************************************************************************************************************************
        }
    }
}