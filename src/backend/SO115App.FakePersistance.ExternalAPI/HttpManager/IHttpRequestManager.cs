﻿using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public interface IHttpRequestManager<ResponseObject> where ResponseObject : class
    {
        void Configure(string cacheString = null);

        Task<ResponseObject> GetAsync(Uri url);
        Task<ResponseObject> PostAsync(Uri url, HttpContent content);
        Task<ResponseObject> PutAsync(Uri url, HttpContent content);
    }
}