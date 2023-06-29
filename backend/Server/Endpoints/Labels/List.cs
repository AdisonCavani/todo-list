using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.OpenApi.Models;
using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Contracts.Responses;
using Server.Repositories;

namespace Server.Endpoints.Labels;

public class List
{
    internal static async Task<Results<StatusCodeHttpResult, Ok<PaginatedRes<LabelDto>>>> HandleAsync(
        [AsParameters] PaginatedReq req,
        HttpContext context,
        ILabelRepository repo,
        CancellationToken ct = default)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.Email)
                     ?? context.User.FindFirstValue(JwtRegisteredClaimNames.Email);

        if (userId is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);

        var response = await repo.ListAsync(req, userId, ct);

        return TypedResults.Ok(response);
    }

    [ExcludeFromCodeCoverage]
    internal static OpenApiOperation OpenApi(OpenApiOperation operation)
    {
        operation.Summary = "Get a paginated list of Labels";

        return operation;
    }
}