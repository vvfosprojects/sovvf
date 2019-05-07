using System;
using System.Linq;

namespace CQRS.Validation
{
    public class ValidationException : Exception
    {
        public ValidationException(ValidationResult[] validationResults) : base(
             string.Join(
                        System.Environment.NewLine,
                        validationResults.Select(vr => vr.UserErrorMessage)))
        {
        }

        public ValidationException()
        {
        }

        public ValidationException(string message)
            : base(message)
        {
        }

        public ValidationException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}