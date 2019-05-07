using System;
using System.Collections.Generic;
using System.Text;

namespace CQRS.Authorization
{
    public class AuthorizationResult
    {
        private readonly string userErrorMessage;
        private readonly string logErrorMessage;

        public AuthorizationResult(string userErrorMessage, string logErrorMessage = null)
        {
            this.userErrorMessage = userErrorMessage;
            this.logErrorMessage = logErrorMessage;
        }

        public string UserErrorMessage
        {
            get
            {
                return this.userErrorMessage;
            }
        }

        public string LogErrorMessage
        {
            get
            {
                return this.logErrorMessage;
            }
        }
    }
}
