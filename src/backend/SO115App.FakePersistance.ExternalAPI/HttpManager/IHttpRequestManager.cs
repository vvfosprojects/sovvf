using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public interface IHttpRequestManager<OutputData>
    {
        void Configure(string cacheString = null);

        Task<OutputData> ExecuteGet(Uri url);

        Task<OutputData> ExecutePost(Uri url, HttpContent content);

        Task<OutputData> ExecutePut(Uri url, HttpContent content);
    }
}
