using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Client
{
    public interface IHttpRequestManager<ResponseObject> where ResponseObject : class
    {
        void SetCache(string cacheString);

        Task<ResponseObject> GetAsync(Uri url, string token = null);

        Task<ResponseObject> GetAsync(Uri url, string username, string password);

        Task<ResponseObject> PostAsync(Uri url, HttpContent content = null, string token = null);

        Task<ResponseObject> PostAsyncFormData(Uri url, HttpContent content = null, string token = null);

        Task<ResponseObject> PostAsync(Uri url, string username, string password, HttpContent content = null);

        Task<ResponseObject> PutAsync(Uri url, HttpContent content = null, string token = null);

        Task<ResponseObject> PutAsync(Uri url, string username, string password, HttpContent content = null);
    }
}
