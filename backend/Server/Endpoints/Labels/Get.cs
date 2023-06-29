using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.OpenApi.Models;
using Server.Contracts.Dtos;
using Server.Repositories;

namespace Server.Endpoints.Labels;

public class Get
{
    internal static async Task<Results<StatusCodeHttpResult, NotFound, Ok<LabelDto>>> HandleAsync(
        [FromRoute] Guid id,
        HttpContext context,
        ILabelRepository repo,
        CancellationToken ct = default)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.Email)
                     ?? context.User.FindFirstValue(JwtRegisteredClaimNames.Email);

        if (userId is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);

        var response = await repo.GetAsync(id, userId, ct);

        if (response is null)
            return TypedResults.NotFound();

        return TypedResults.Ok(response);
    }

    [ExcludeFromCodeCoverage]
    internal static OpenApiOperation OpenApi(OpenApiOperation operation)
    {
        operation.Summary = "Get Label by id";

        return operation;
    }
}