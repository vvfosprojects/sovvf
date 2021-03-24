﻿using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.UndoMergeSchedeNue;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto
{
    public interface INotificationUndoMergeSchedeNue
    {
        Task SendNotification(UndoMergeSchedeNueCommand command);
    }
}
