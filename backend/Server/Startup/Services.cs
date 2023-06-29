using Amazon.DynamoDBv2;
using Server.Repositories;

namespace Server.Startup;

public static class Services
{
    public static void AddServices(this IServiceCollection services, IWebHostEnvironment environment)
    {
        services.AddSingleton<ILabelRepository, LabelRepository>();
        services.AddSingleton<ITaskRepository, TaskRepository>();
        
        var config = environment.IsProduction()
            ? new AmazonDynamoDBConfig()
            : new AmazonDynamoDBConfig
            {
                ServiceURL = "http://localhost:8000"
            };

        services.AddSingleton<IAmazonDynamoDB>(_ => new AmazonDynamoDBClient(config));
    }
}