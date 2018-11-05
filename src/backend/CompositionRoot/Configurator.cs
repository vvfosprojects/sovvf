using Modello.AOP.Validation;
using Modello.Classi.Soccorso.Risorse;
using Modello.Servizi.CQRS.Commands;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra.CommandDTO;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO;
using Modello.Servizi.CQRS.Queries;
using Modello.Servizi.Infrastruttura.Anagrafiche;
using Modello.Servizi.Infrastruttura.Autenticazione;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.CompetenzeTerritoriali;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using Modello.Servizi.Infrastruttura.Organigramma;
using Modello.Servizi.Infrastruttura.Organigramma.Implementazioni;
using SimpleInjector;


using SOVVF.FakeImplementations;
using SOVVF.FakeImplementations.Modello.Autenticazione;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse;
using SOVVF.FakeImplementations.Modello.Infrastruttura.Anagrafiche;
using SOVVF.FakeImplementations.Modello.Infrastruttura.CompetenzeTerritoriali;
using SOVVF.FakeImplementations.Modello.Organigramma;

namespace CompositionRoot
{
    public static class Configurator
    {
        public static void Configure(Container c)
        {
            
            c.Register(
                typeof(ICommandHandler<>),
                typeof(ICommandHandler<>).Assembly);

            c.Register(
                typeof(IQueryHandler<,>), 
                typeof(IQueryHandler<,>).Assembly);

            c.Collection.Register(
                typeof(ICommandValidator<>),
                typeof(SelezionaSquadraCommand).Assembly);

            c.RegisterDecorator(
                typeof(ICommandHandler<>),
                typeof(ValidatingCommandHandlerDecorator<>));

            //c.RegisterDecorator(
            //    typeof(IQueryHandler<,>),
            //    typeof(ValidatingQueryHandlerDecorator<,>));
            
            c.Register<IGetUnitaOperativaPerCodice, GetUnitaOperativaPerCodice>();




            //TEST AND FAKE
            //************************************************************************************************************************
            c.Register<IGetOperatoreAutenticato, GetOperatoreAutenticato>();
            c.Register<IGetUnitaOperativaRadice, GetUnitaOperativaRadice_OrganigrammaCONRidottoCablato>();
            c.Register<IGetUnitaOperativeVisibiliPerSoccorso, GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio>();
            c.Register<IGetSituazioneMezzi, GetSituazioneMezzi_RandomFake>();
            c.Register<IGetTipoInterventoByCodice, GetTipoInterventoByCodice_Fake>();
            c.Register<ITestAndSetSelezioneDisponibilitaSquadra, TestAndSetSelezioneDisponibilitaSquadra_Fake>();
            c.Register<ITestAndSetSelezioneDisponibilitaMezzo, TestAndSetSelezioneDisponibilitaMezzo_Fake>();
            c.Register<ITestAndSetDeselezioneDisponibilitaSquadra, TestAndSetDeselezioneDisponibilitaSquadra_DoNothing>();
            c.Register<ITestAndSetDeselezioneDisponibilitaMezzo, TestAndSetDeselezioneDisponibilitaMezzo_DoNothing>();
            c.Register<ISaveRichiestaAssistenza, SaveRichiestaDiAssistenza_Fake>();
            c.Register<IGetRichiestaAssistenzaById, GetRichiestaAssistenzaById_Fake>();
            c.Register<ICercaRichiesteAssistenza, CercaRichiesteAssistenza_Empty>();
            c.Register<IGetNumeroMezziSoccorsoOraInServizio, GetNumeroMezziSoccorsoOraInServizio_Fake>();
            c.Register<IGetNumeroSquadreSoccorsoOraInServizio, GetNumeroSquadreSoccorsoOraInServizio_Fake>();
            c.Register<IGetCompetenzeByPunto, GetCompetenzeByPunto_Fake_Hardcoded>();
            //************************************************************************************************************************


        }
    }
}