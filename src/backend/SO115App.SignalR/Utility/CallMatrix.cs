using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.Models.Classi.Matrix;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Runtime.Serialization.Json;
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
                //_client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_config.GetSection("UrlMatrix").Value}/directory/room/%23comando.{codSede.ToLower()}:vvf-test.cloud").ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    using HttpContent content = response.Content;
                    var data = await content.ReadAsStringAsync().ConfigureAwait(false);
                    var RispostaCas = JsonConvert.DeserializeObject<ChatRoom>(data);

                    return RispostaCas;
                }
                else
                {
                    ChatRoom RispostaCas = new ChatRoom();
                    RispostaCas.Error = response.ReasonPhrase;
                    return RispostaCas;
                }
            }
            catch (HttpRequestException e)
            {
                ChatRoom RispostaCas = new ChatRoom();
                RispostaCas.Error = e.Message;
                return RispostaCas;
            }
            catch (Exception e)
            {
                ChatRoom RispostaCas = new ChatRoom();
                RispostaCas.Error = e.Message;
                return RispostaCas;
            }
        }

        public async Task<string> PostBotInChatRoom(string room_id)
        {
            try
            {
                StreamReader sr = new StreamReader(room_id);
                StringContent content = new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json");

                //_client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("test");
                var response = await _client.PostAsync($"{_config.GetSection("UrlMatrix").Value}/rooms/{room_id}/join?access_token=MDAxY2xvY2F0aW9uIHZ2Zi10ZXN0LmNsb3VkCjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDAyNmNpZCB1c2VyX2lkID0gQGJvdDp2dmYtdGVzdC5jbG91ZAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IG5DO0BHOF5tN2FUOkBVXj0KMDAyZnNpZ25hdHVyZSC0LHxje1QcxZu6AytsGKUkL3-KOfagMBKQq3aCxHXiIQo", content).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    return " Bot inviato con successo";
                }
                else
                {
                    return response.ReasonPhrase;
                }
            }
            catch (HttpRequestException e)
            {
                return e.Message;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public async Task<string> PutMessage(string room_id, string message)
        {
            var randomId = RandomString(10);

            try
            {
                //_client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("test");

                SendMessage send = new SendMessage()
                {
                    Body = message,
                    Msgtype = "m.text"
                };

                MemoryStream ms = new MemoryStream();
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(SendMessage));
                ser.WriteObject(ms, send);
                ms.Position = 0;
                StreamReader sr = new StreamReader(ms);

                StringContent content = new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json");

                var response = await _client.PutAsync($"{_config.GetSection("UrlMatrix").Value}/rooms/{room_id}/send/m.room.message/{randomId}?access_token=MDAxY2xvY2F0aW9uIHZ2Zi10ZXN0LmNsb3VkCjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDAyNmNpZCB1c2VyX2lkID0gQGJvdDp2dmYtdGVzdC5jbG91ZAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IG5DO0BHOF5tN2FUOkBVXj0KMDAyZnNpZ25hdHVyZSC0LHxje1QcxZu6AytsGKUkL3-KOfagMBKQq3aCxHXiIQo", content).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    return "Invio effettuato con successo";
                }
                else
                {
                    return response.ReasonPhrase;
                }
            }
            catch (HttpRequestException e)
            {
                return e.Message;
            }
            catch (Exception e)
            {
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
