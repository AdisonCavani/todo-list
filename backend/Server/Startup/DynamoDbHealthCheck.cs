using System.Net;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Server.Startup;

public class DynamoDbHealthCheck : IHealthCheck
{
    private readonly IAmazonDynamoDB _client;
    
    private static readonly string TableName =
        Environment.GetEnvironmentVariable(EnvVariables.TableName) ??
        throw new Exception(
            $"{nameof(EnvVariables.TableName)} env variable cannot be null");

    public DynamoDbHealthCheck(IAmazonDynamoDB client)
    {
        _client = client;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default)
    {
        var request = new DescribeTableRequest
        {
            TableName = TableName
        };
        
        var response = await _client.DescribeTableAsync(request, ct);

        return response.HttpStatusCode == HttpStatusCode.OK
            ? HealthCheckResult.Healthy()
            : HealthCheckResult.Unhealthy();
    }
}