using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SO115App.API.Models.Classi.Notifications;

namespace SO115App.API.Models.Servizi
{
    public interface IActionGeneric<T>
    {
        Boolean GetAutorization(String obj);
        
        String Action(T obj);

        Task SendNotification(T obj);

    }
}