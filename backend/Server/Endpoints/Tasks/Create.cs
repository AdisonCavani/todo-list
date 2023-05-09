﻿using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Repositories;

namespace Server.Endpoints.Tasks;

public static class Create
{
    public static async Task<Results<StatusCodeHttpResult, Ok<TaskDto>>> HandleAsync(
        [FromBody] CreateTaskReq req,
        HttpContext context,
        [FromServices] ITaskRepository repo,
        CancellationToken ct = default)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);

        var response = await repo.CreateAsync(req, userId, ct);

        if (response is null)
            return TypedResults.StatusCode(StatusCodes.Status500InternalServerError);

        return TypedResults.Ok(response);
    }
}