using System.Net;
using System.Net.Http.Json;
using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Startup;
using Server.Tests.Integration.Helpers;

namespace Server.Tests.Integration.Endpoints.Tasks;

[Collection(SharedTestCollection.Name)]
public class CreateTests : IAsyncLifetime
{
    private readonly TasksApiFactory _factory;
    private readonly HttpClient _httpClient;

    private static readonly string TableName =
        Environment.GetEnvironmentVariable(EnvVariables.TableName) ??
        throw new Exception(
            $"{nameof(EnvVariables.TableName)} env variable cannot be null");

    public CreateTests(TasksApiFactory factory)
    {
        _factory = factory;
        _httpClient = factory.HttpClient;
    }

    [Fact]
    public async Task Should_ReturnCreatedAt_WhenOk()
    {
        var request = new CreateTaskReq
        {
            Title = "New task"
        };

        var response = await _httpClient.PostAsJsonAsync("/api/tasks", request);
        
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var createdResult = await response.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(createdResult); // TODO: verify createdAt uri
    }
    
    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync() => await Database.ResetAsync(_factory, TableName);
}