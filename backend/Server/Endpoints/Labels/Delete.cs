using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.OpenApi.Models;
using Server.Repositories;

namespace Server.Endpoints.Labels;

public class Delete
{
    internal static async Task<Results<StatusCodeHttpResult, NoContent, NotFound>> HandleAsync(
        [FromRoute] Guid id,
        HttpContext context,
        ILabelRepository repo,
        CancellationToken ct = default)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.Email)
                     ?? context.User.FindFirstValue(JwtRegisteredClaimNames.Email);

        if (userId is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);

        var deleted = await repo.DeleteAsync(id, userId, ct);

        return deleted ? TypedResults.NoContent() : TypedResults.NotFound();
    }

    [ExcludeFromCodeCoverage]
    internal static OpenApiOperation OpenApi(OpenApiOperation operation)
    {
        operation.Summary = "Delete Label by id";

        return operation;
    }
}