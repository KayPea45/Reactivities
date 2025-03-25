
// An object that stores the result of an API call. Will be used when we are calling or executing the handler in our Command and Query classes.
namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Value { get; set; }
        public string? Error { get; set; }
        public int Code { get; set; }

        public static Result<T> Success(T value) => new()
        {
            IsSuccess = true,
            Value = value
        };

        public static Result<T> Failure(string error, int code) => new()
        {
            IsSuccess = false,
            Error = error,
            Code = code
        };

    }
}