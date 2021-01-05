using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public interface IHttpRequestManager<ResponseObject> where ResponseObject : class
    {
        void Configure(string cacheString = null);

        Task<ResponseObject> GetAsync(Uri url, string token);
        Task<ResponseObject> GetAsync(Uri url, string username, string password);

        Task<ResponseObject> PostAsync(Uri url, HttpContent content, string token);
        Task<ResponseObject> PostAsync(Uri url, HttpContent content, string username, string password);

        Task<ResponseObject> PutAsync(Uri url, HttpContent content, string token);
        Task<ResponseObject> PutAsync(Uri url, HttpContent content, string username, string password);
    }
}
