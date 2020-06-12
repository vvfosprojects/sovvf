using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Serilog;
using SO115App.Models.Classi.Matrix;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.SignalR.Utility
{
    public class CallMatrix
    {
        private static Random random = new Random();
        private readonly HttpClient _client;
        private readonly IConfiguration _config;

        public CallMatrix(HttpClient client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<ChatRoom> GetChatRoomID(string codSede)
        {
            try
            {
                Log.Information("MATRIX - Inizio chiamata GET");

                Log.Information($"MATRIX - URL CHIAMATA GET - {_config.GetSection("UrlMatrix").Value}/directory/room/%23comando.{codSede.ToLower()}:vvf-test.cloud");

                //_client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_config.GetSection("UrlMatrix").Value}/directory/room/%23comando.{codSede.ToLower()}:vvf-test.cloud").ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    using HttpContent content = response.Content;
                    var data = await content.ReadAsStringAsync().ConfigureAwait(false);
                    var RispostaCas = JsonConvert.DeserializeObject<ChatRoom>(data);

                    Log.Information($"MATRIX - RISULTATO CHIAMATA GET OK");

                    Log.Information($"MATRIX - FINE CHIAMATA GET");

                    return RispostaCas;
                }
                else
                {
                    ChatRoom RispostaCas = new ChatRoom();
                    RispostaCas.Error = response.ReasonPhrase;

                    Log.Information($"MATRIX - RISULTATO CHIAMATA GET KO - " + response.ReasonPhrase);
                    Log.Information($"MATRIX - RISULTATO CHIAMATA GET CONTENT - " + response.Content.ToString());
                    Log.Information($"MATRIX - FINE CHIAMATA GET");

                    return RispostaCas;
                }
            }
            catch (HttpRequestException e)
            {
                ChatRoom RispostaCas = new ChatRoom();
                RispostaCas.Error = e.Message;

                Log.Information($"MATRIX - RISULTATO CHIAMATA GET KO Message 1 - " + e.InnerException);

                Log.Information($"MATRIX - FINE CHIAMATA GET");

                return RispostaCas;
            }
            catch (Exception e)
            {
                ChatRoom RispostaCas = new ChatRoom();
                RispostaCas.Error = e.Message;

                Log.Information($"MATRIX - RISULTATO CHIAMATA GET KO Message 2 - " + e.Message);

                Log.Information($"MATRIX - FINE CHIAMATA GET");

                return RispostaCas;
            }
        }

        public async Task<string> PostBotInChatRoom(string room_id)
        {
            try
            {
                //_client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("test");

                Log.Information($"MATRIX - INIZIO CHIAMATA POST");

                Log.Information($"MATRIX - URL CHIAMATA POST - {_config.GetSection("UrlMatrix").Value}/rooms/{room_id.Replace("!", "%21")}/join?access_token=MDAxY2xvY2F0aW9uIHZ2Zi10ZXN0LmNsb3VkCjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDAyNmNpZCB1c2VyX2lkID0gQGJvdDp2dmYtdGVzdC5jbG91ZAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IG5DO0BHOF5tN2FUOkBVXj0KMDAyZnNpZ25hdHVyZSC0LHxje1QcxZu6AytsGKUkL3-KOfagMBKQq3aCxHXiIQo");

                var response = await _client.PostAsync($"{_config.GetSection("UrlMatrix").Value}/rooms/{room_id.Replace("!", "%21")}/join?access_token=MDAxY2xvY2F0aW9uIHZ2Zi10ZXN0LmNsb3VkCjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDAyNmNpZCB1c2VyX2lkID0gQGJvdDp2dmYtdGVzdC5jbG91ZAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IG5DO0BHOF5tN2FUOkBVXj0KMDAyZnNpZ25hdHVyZSC0LHxje1QcxZu6AytsGKUkL3-KOfagMBKQq3aCxHXiIQo", null).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    Log.Information($"MATRIX - ESITO CHIAMATA POST OK ");
                    Log.Information($"MATRIX - FINE CHIAMATA POST ");
                    return " Bot inviato con successo";
                }
                else
                {
                    Log.Information($"MATRIX - ESITO CHIAMATA POST KO - " + response.ReasonPhrase);
                    Log.Information($"MATRIX - RISULTATO CHIAMATA POST Headers - " + response.Headers.ToString());
                    Log.Information($"MATRIX - FINE CHIAMATA POST ");
                    return response.ReasonPhrase;
                }
            }
            catch (HttpRequestException e)
            {
                Log.Information($"MATRIX - ESITO CHIAMATA POST KO Message 3 - " + e.InnerException);
                Log.Information($"MATRIX - FINE CHIAMATA POST ");
                return e.Message;
            }
            catch (Exception e)
            {
                Log.Information($"MATRIX - ESITO CHIAMATA POST KO  Message 4 - " + e.Message);
                Log.Information($"MATRIX - FINE CHIAMATA POST ");

                return e.Message;
            }
        }

        public async Task<string> PutMessage(string room_id, string message)
        {
            var randomId = RandomString(10);

            try
            {
                //_client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("test");

                Log.Information($"MATRIX - INIZIO CHIAMATA PUT");

                Log.Information($"MATRIX - URL CHIAMATA PUT - {_config.GetSection("UrlMatrix").Value}/rooms/{room_id.Replace("!", "%21")}/send/m.room.message/{randomId}?access_token=MDAxY2xvY2F0aW9uIHZ2Zi10ZXN0LmNsb3VkCjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDAyNmNpZCB1c2VyX2lkID0gQGJvdDp2dmYtdGVzdC5jbG91ZAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IG5DO0BHOF5tN2FUOkBVXj0KMDAyZnNpZ25hdHVyZSC0LHxje1QcxZu6AytsGKUkL3-KOfagMBKQq3aCxHXiIQo");

                SendMessage send = new SendMessage()
                {
                    Body = message,
                    Msgtype = "m.text"
                };

                var jsonString = "{\"msgtype\":\"" + send.Msgtype + "\",\"body\":\"" + send.Body + "\"}";
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                var response = await _client.PutAsync($"{_config.GetSection("UrlMatrix").Value}/rooms/{room_id.Replace("!", "%21")}/send/m.room.message/{randomId}?access_token=MDAxY2xvY2F0aW9uIHZ2Zi10ZXN0LmNsb3VkCjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDAyNmNpZCB1c2VyX2lkID0gQGJvdDp2dmYtdGVzdC5jbG91ZAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IG5DO0BHOF5tN2FUOkBVXj0KMDAyZnNpZ25hdHVyZSC0LHxje1QcxZu6AytsGKUkL3-KOfagMBKQq3aCxHXiIQo", httpContent).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    Log.Information($"MATRIX - ESITO CHIAMATA PUT OK ");
                    Log.Information($"MATRIX - FINE CHIAMATA PUT ");

                    return "Invio effettuato con successo";
                }
                else
                {
                    Log.Information($"MATRIX - ESITO CHIAMATA PUT KO - " + response.ReasonPhrase);
                    Log.Information($"MATRIX - RISULTATO CHIAMATA POST Headers - " + response.Headers.ToString());
                    Log.Information($"MATRIX - FINE CHIAMATA PUT ");

                    return response.ReasonPhrase;
                }
            }
            catch (HttpRequestException e)
            {
                Log.Information($"MATRIX - ESITO CHIAMATA PUT KO -  Message 5 " + e.InnerException);

                Log.Information($"MATRIX - FINE CHIAMATA PUT ");

                return e.Message;
            }
            catch (Exception e)
            {
                Log.Information($"MATRIX - ESITO CHIAMATA PUT KO - Message 6 " + e.Message);
                Log.Information($"MATRIX - FINE CHIAMATA PUT ");

                return e.Message;
            }
        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
