using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CQRS.Authorization
{
    public class AuthorizationException : Exception
    {
        public AuthorizationException(AuthorizationResult[] authorizationResults) : base(
             string.Join(
                        System.Environment.NewLine,
                        authorizationResults.Select(vr => vr.UserErrorMessage)))
        {
        }

        public AuthorizationException()
        {
        }

        public AuthorizationException(string message)
            : base(message)
        {
        }

        public AuthorizationException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
