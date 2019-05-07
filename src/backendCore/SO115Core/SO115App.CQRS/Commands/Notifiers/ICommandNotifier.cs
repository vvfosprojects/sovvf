namespace CQRS.Commands.Notifiers
{
    public interface ICommandNotifier<TCommand>
    {
        void Notify(TCommand command);
    }
}