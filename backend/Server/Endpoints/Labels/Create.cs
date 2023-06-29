using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.OpenApi.Models;
using Server.Contracts;
using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Repositories;

namespace Server.Endpoints.Labels;

public static class Create
{
    public static async Task<Results<StatusCodeHttpResult, Created<LabelDto>>> HandleAsync(
        [FromBody] CreateLabelReq req,
        HttpContext context,
        ILabelRepository repo,
        CancellationToken ct = default)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.Email)
                     ?? context.User.FindFirstValue(JwtRegisteredClaimNames.Email);

        if (userId is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);
        
        var response = await repo.CreateAsync(req, userId, ct);

        if (response is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);
        
        return TypedResults.Created($"{ApiRoutes.Labels}/{response.Id}",response);
    }
    
    [ExcludeFromCodeCoverage]
    internal static OpenApiOperation OpenApi(OpenApiOperation operation)
    {
        operation.Summary = "Create new Label";

        return operation;
    }
}