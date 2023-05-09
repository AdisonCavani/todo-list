﻿using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.Repositories;

namespace Server.Endpoints.Tasks;

public static class Delete
{
    public static async Task<Results<StatusCodeHttpResult, NoContent, NotFound>> HandleAsync(
        [FromRoute] Guid id,
        HttpContext context,
        [FromServices] ITaskRepository repo,
        CancellationToken ct = default)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);

        var deleted = await repo.DeleteAsync(id, userId, ct);

        return deleted ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}