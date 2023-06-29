using FluentValidation;
using Server.Contracts.Requests;

namespace Server.Validators;

public class UpdateLabelReqValidator : AbstractValidator<UpdateLabelReq>
{
    public UpdateLabelReqValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}