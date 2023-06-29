using System.Net;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.DependencyInjection;
using Server.Contracts.Requests;
using Server.Mappers;
using Server.Startup;
using Server.Tests.Integration.Helpers;

namespace Server.Tests.Integration.Endpoints.Tasks;

[Collection(SharedTestCollection.Name)]
public class DeleteTests : IAsyncLifetime
{
    private readonly TasksApiFactory _factory;
    private readonly HttpClient _httpClient;

    private static readonly string TableName =
        Environment.GetEnvironmentVariable(EnvVariables.TableName) ??
        throw new Exception(
            $"{nameof(EnvVariables.TableName)} env variable cannot be null");

    public DeleteTests(TasksApiFactory factory)
    {
        _factory = factory;
        _httpClient = factory.HttpClient;
    }

    [Fact]
    public async Task Should_ReturnNotFound_WhenIdDoesNotExist()
    {
        var response = await _httpClient.DeleteAsync($"/api/tasks/{Guid.NewGuid()}");
        
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
    
    [Fact]
    public async Task Should_ReturnNoContent_WhenOk()
    {
        // Arrange
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
        
        // Act
        var response = await _httpClient.DeleteAsync($"/api/tasks/{entity.Id}");
        
        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
    
    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync() => await Database.ResetAsync(_factory, TableName);
}