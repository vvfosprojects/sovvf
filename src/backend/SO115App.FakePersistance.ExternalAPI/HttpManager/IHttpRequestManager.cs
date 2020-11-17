using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public interface IHttpRequestManager<OutputData>
    {
        void Configure(string cacheString = null);

        Task<OutputData> GetAsync(Uri url);
        Task<OutputData> PostAsync(Uri url, HttpContent content);
        Task<OutputData> PutAsync(Uri url, HttpContent content);
    }
}
