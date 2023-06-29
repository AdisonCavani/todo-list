using FluentValidation;
using Server.Contracts.Requests;

namespace Server.Validators;

public class CreateLabelReqValidator : AbstractValidator<CreateLabelReq>
{
    public CreateLabelReqValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}