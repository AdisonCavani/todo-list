using System.Net;
using System.Net.Http.Json;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.DependencyInjection;
using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Mappers;
using Server.Startup;
using Server.Tests.Integration.Helpers;

namespace Server.Tests.Integration.Endpoints.Tasks;

[Collection(SharedTestCollection.Name)]
public class GetTests : IAsyncLifetime
{
    private readonly TasksApiFactory _factory;
    private readonly HttpClient _httpClient;

    private static readonly string TableName =
        Environment.GetEnvironmentVariable(EnvVariables.TableName) ??
        throw new Exception(
            $"{nameof(EnvVariables.TableName)} env variable cannot be null");

    public GetTests(TasksApiFactory factory)
    {
        _factory = factory;
        _httpClient = factory.HttpClient;
    }

    [Fact]
    public async Task Should_Return404_WhenTaskDoesNotExist()
    {
        var response = await _httpClient.GetAsync($"/api/tasks/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Should_ReturnOk_WhenOk()
    {
        await using var scope = _factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<IAmazonDynamoDB>();

        var entity = new CreateTaskReq
        {
            Title = "New task"
        }.ToTaskEntity(TestAuthHandler.UserId);

        var createItemReq = new PutItemRequest
        {
            TableName = TableName,
            Item = DynamoDbMapper.ToDict(entity)
        };

        await db.PutItemAsync(createItemReq);

        var response = await _httpClient.GetAsync($"/api/tasks/{entity.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var okResult = await response.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(okResult);
        Assert.Equivalent(entity.ToTaskDto(), okResult);
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync() => await Database.ResetAsync(_factory, TableName);
}