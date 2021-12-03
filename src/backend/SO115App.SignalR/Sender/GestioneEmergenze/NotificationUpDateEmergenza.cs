using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationUpDateEmergenza : INotifyUpDateEmergenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IUpDateEmergenza _upDateEmergenza;

        public NotificationUpDateEmergenza(IHubContext<NotificationHub> notificationHubContext,
                                           GetGerarchiaToSend getGerarchiaToSend,
                                           IUpDateEmergenza upDateEmergenza)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _upDateEmergenza = upDateEmergenza;
        }

        void INotifyUpDateEmergenza.Send(Emergenza emergenza)
        {
            var ListaSediDestinatarie = _getGerarchiaToSend.Get(emergenza.CodComandoRichiedente);

            _notificationHubContext.Clients.Group("00").SendAsync("NotifyModificaEmergenza", emergenza);

            Parallel.ForEach(ListaSediDestinatarie, sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyModificaEmergenza", emergenza);

                //NOTIFICA NAVBAR
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                {
                    Titolo = "Emergenza aggiornata",
                    Descrizione = $"E' stata aggiornata l'emergenza {emergenza.CodEmergenza} da parte del comando {emergenza.CodComandoRichiedente}",
                    Tipo = TipoNotifica.UpDateEmergenza,
                    Data = DateTime.Now
                });
            }
            );

            if (emergenza.ListaModuliImmediata != null)
            {
                foreach (var modulo in emergenza.ListaModuliImmediata.FindAll(c => !c.SediAllertate).ToList())
                {
                    modulo.SediAllertate = true;
                    //NOTIFICA NAVBAR

                    foreach (var mezzo in modulo.Mezzi)
                    {
                        _notificationHubContext.Clients.Group(mezzo.Distaccamento.Codice).SendAsync("NotifyNavBar", new Notifica()
                        {
                            Titolo = "Richiesto Mezzo per Emergenza",
                            Descrizione = $"E' stato richiesto il mezzo {mezzo.Codice} per l'emergenza {emergenza.CodEmergenza} in quanto parte della colonna mobile {modulo.NomeModulo}",
                            Tipo = TipoNotifica.UpDateEmergenza,
                            Data = DateTime.Now
                        });
                    }
                }
            }

            if (emergenza.ListaModuliPotInt != null)
            {
                foreach (var modulo in emergenza.ListaModuliPotInt.FindAll(c => !c.SediAllertate).ToList())
                {
                    modulo.SediAllertate = true;
                    //NOTIFICA NAVBAR
                    foreach (var mezzo in modulo.Mezzi)
                    {
                        _notificationHubContext.Clients.Group(mezzo.Distaccamento.Codice).SendAsync("NotifyNavBar", new Notifica()
                        {
                            Titolo = "Richiesto Mezzo per Emergenza",
                            Descrizione = $"E' stato richiesto il mezzo {mezzo.Codice} per l'emergenza {emergenza.CodEmergenza} in quanto parte della colonna mobile {modulo.NomeModulo}",
                            Tipo = TipoNotifica.UpDateEmergenza,
                            Data = DateTime.Now
                        });
                    }
                }
            }

            if (emergenza.ListaModuliConsolidamento != null)
            {
                foreach (var modulo in emergenza.ListaModuliConsolidamento.FindAll(c => !c.SediAllertate).ToList())
                {
                    modulo.SediAllertate = true;
                    //NOTIFICA NAVBAR
                    foreach (var mezzo in modulo.Mezzi)
                    {
                        _notificationHubContext.Clients.Group(mezzo.Distaccamento.Codice).SendAsync("NotifyNavBar", new Notifica()
                        {
                            Titolo = "Richiesto Mezzo per Emergenza",
                            Descrizione = $"E' stato richiesto il mezzo {mezzo.Codice} per l'emergenza {emergenza.CodEmergenza} in quanto parte della colonna mobile {modulo.NomeModulo}",
                            Tipo = TipoNotifica.UpDateEmergenza,
                            Data = DateTime.Now
                        });
                    }
                }
            }

            _upDateEmergenza.Update(emergenza);
        }
    }
}
