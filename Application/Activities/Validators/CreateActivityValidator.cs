using Application.Activities.Commands;
using Application.Activities.DTOs;

namespace Application.Activities.Validators;

// Inherit AbstractValidator from FluentValidation that will give us access to methods from FluentValidation to help us validate our data.
// We also tell what we want to validate, i.e <CreateActivity.Command>
public class CreateActivityValidator : BaseActivityValidator<CreateActivity.Command, CreateActivityDto>
{
    public CreateActivityValidator() : base(x => x.ActivityDto)
    {
    }
}
