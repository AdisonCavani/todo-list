using Server.Contracts;
using Server.Contracts.Requests;
using Server.Filters;

namespace Server.Endpoints;

public static class Map
{
    private static void MapLabelsApi(this RouteGroupBuilder group)
    {
        group.MapPost("/", Labels.Create.HandleAsync)
            .RequireAuthorization()
            .AddEndpointFilter<ValidationFilter<CreateLabelReq>>()
            .WithOpenApi(Labels.Create.OpenApi);

        group.MapGet("/{id}", Labels.Get.HandleAsync)
            .RequireAuthorization()
            .WithOpenApi(Labels.Get.OpenApi);

        group.MapDelete("/{id}", Labels.Delete.HandleAsync)
            .RequireAuthorization()
            .WithOpenApi(Labels.Delete.OpenApi);

        group.MapGet("/", Labels.List.HandleAsync)
            .RequireAuthorization()
            .AddEndpointFilter<ValidationFilter<PaginatedReq>>()
            .WithOpenApi(Labels.List.OpenApi);

        group.MapPatch("/", Labels.Update.HandleAsync)
            .RequireAuthorization()
            .AddEndpointFilter<ValidationFilter<UpdateLabelReq>>()
            .WithOpenApi(Labels.Update.OpenApi);

        group.WithTags("Label Endpoint");
    }
    
    private static void MapTasksApi(this RouteGroupBuilder group)
    {
        group.MapPost("/", Tasks.Create.HandleAsync)
            .RequireAuthorization()
            .AddEndpointFilter<ValidationFilter<CreateTaskReq>>()
            .WithOpenApi(Tasks.Create.OpenApi);

        group.MapGet("/{id}", Tasks.Get.HandleAsync)
            .RequireAuthorization()
            .WithOpenApi(Tasks.Get.OpenApi);

        group.MapDelete("/{id}", Tasks.Delete.HandleAsync)
            .RequireAuthorization()
            .WithOpenApi(Tasks.Delete.OpenApi);

        group.MapGet("/", Tasks.List.HandleAsync)
            .RequireAuthorization()
            .AddEndpointFilter<ValidationFilter<PaginatedReq>>()
            .WithOpenApi(Tasks.List.OpenApi);

        group.MapPatch("/", Tasks.Update.HandleAsync)
            .RequireAuthorization()
            .AddEndpointFilter<ValidationFilter<UpdateTaskReq>>()
            .WithOpenApi(Tasks.Update.OpenApi);

        group.WithTags("Task Endpoint");
    }
    
    public static void MapEndpoints(this WebApplication app)
    {
        app.MapGet(ApiRoutes.Health, Health.HandleAsync)
            .WithTags("Health Endpoint")
            .WithOpenApi(Health.OpenApi);
        
        app.MapGroup(ApiRoutes.Labels).MapLabelsApi();
        app.MapGroup(ApiRoutes.Tasks).MapTasksApi();
    }
}