using System;
using Microsoft.AspNetCore.SignalR;
using SimpleInjector;

public sealed class SimpleInjectorHubActivator<T> : IHubActivator<T> where T : Hub 
{
    private readonly Container container;

    public SimpleInjectorHubActivator(Container container) {
        this.container = container ?? throw new ArgumentNullException(nameof(container));
    }

    public T Create() => container.GetInstance<T>();

    public void Release(T hub) 
    {
        // Simple Injector  takes care of this
    }
}