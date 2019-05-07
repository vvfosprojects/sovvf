using System;
using System.Collections.Generic;
using System.Text;

namespace CQRS.Validation
{
    public class ValidationResult
    {
        private readonly string userErrorMessage;
        private readonly string logErrorMessage;

        public ValidationResult(string userErrorMessage, string logErrorMessage = null)
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
