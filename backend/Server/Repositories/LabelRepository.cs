using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Contracts.Responses;
using Server.Mappers;
using Server.Startup;

namespace Server.Repositories;

public class LabelRepository : ILabelRepository
{
    private readonly IAmazonDynamoDB _client;

    private static readonly string TableName =
        Environment.GetEnvironmentVariable(EnvVariables.TableName) ??
        throw new Exception(
            $"{nameof(EnvVariables.TableName)} env variable cannot be null");

    public LabelRepository(IAmazonDynamoDB client)
    {
        _client = client;
    }
    
    public async Task<LabelDto?> CreateAsync(CreateLabelReq req, string userId, CancellationToken ct = default)
    {
        var entity = req.ToLabelEntity(userId);

        var createItemReq = new PutItemRequest
        {
            TableName = TableName,
            Item = DynamoDbMapper.ToDict(entity)
        };

        var response = await _client.PutItemAsync(createItemReq, ct);

        if (response.HttpStatusCode != HttpStatusCode.OK)
            return null;

        return entity.ToLabelDto();
    }

    public async Task<LabelDto?> GetAsync(Guid id, string userId, CancellationToken ct = default)
    {
        var request = new GetItemRequest
        {
            TableName = TableName,
            Key = new()
            {
                {LabelMapper.Pk, LabelMapper.GetPk(userId)},
                {LabelMapper.Sk, LabelMapper.GetSk(id)}
            }
        };

        var response = await _client.GetItemAsync(request, ct);

        if (!response.IsItemSet)
            return null;

        return DynamoDbMapper.FromDict(response.Item, SerializationContext.Default.LabelEntity)?.ToLabelDto();
    }

    public async Task<LabelDto?> UpdateAsync(UpdateLabelReq req, string userId, CancellationToken ct = default)
    {
        var entity = req.ToLabelEntity(userId);

        var updateItemReq = new PutItemRequest
        {
            TableName = TableName,
            Item = DynamoDbMapper.ToDict(entity),
            ConditionExpression = $"{LabelMapper.Pk} = :v_pk AND {LabelMapper.Sk} = :v_sk",
            ExpressionAttributeValues = new()
            {
                {":v_pk", LabelMapper.GetPk(userId)},
                {":v_sk", LabelMapper.GetSk(req.Id)}
            }
        };

        try
        {
            var response = await _client.PutItemAsync(updateItemReq, ct);

            if (response.HttpStatusCode != HttpStatusCode.OK)
                return null;

            return entity.ToLabelDto();
        }
        catch (ConditionalCheckFailedException)
        {
            return null;
        }
    }

    public async Task<bool> DeleteAsync(Guid id, string userId, CancellationToken ct = default)
    {
        var deleteItemReq = new DeleteItemRequest
        {
            TableName = TableName,
            Key = new()
            {
                {LabelMapper.Pk, LabelMapper.GetPk(userId)},
                {LabelMapper.Sk, LabelMapper.GetSk(id)}
            },
            ReturnValues = ReturnValue.ALL_OLD
        };

        var response = await _client.DeleteItemAsync(deleteItemReq, ct);
        return response.HttpStatusCode == HttpStatusCode.OK && response.Attributes.Count > 0;
    }

    public async Task<PaginatedRes<LabelDto>> ListAsync(PaginatedReq req, string userId, CancellationToken ct = default)
    {
        var exclusiveStartKey = string.IsNullOrWhiteSpace(req.PageKey)
            ? null
            : JsonSerializer.Deserialize<Dictionary<string, AttributeValue>>(Convert.FromBase64String(req.PageKey));

        var queryRequest = new QueryRequest
        {
            TableName = TableName,
            Limit = req.PageSize,
            ExclusiveStartKey = exclusiveStartKey,
            KeyConditionExpression = $"{LabelMapper.Pk} = :v_pk",
            ExpressionAttributeValues = new()
            {
                {":v_pk", LabelMapper.GetPk(userId)}
            }
        };

        var response = await _client.QueryAsync(queryRequest, ct);

        var data = new List<LabelDto>();

        foreach (var item in response.Items)
        {
            var entity = DynamoDbMapper.FromDict(item, SerializationContext.Default.LabelEntity);

            if (entity is not null)
                data.Add(entity.ToLabelDto());
        }

        var nextPageKey = response.LastEvaluatedKey.Count == 0
            ? null
            : Convert.ToBase64String(JsonSerializer.SerializeToUtf8Bytes(response.LastEvaluatedKey,
                new JsonSerializerOptions
                {
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault
                }));

        return new()
        {
            PageKey = req.PageKey,
            PageSize = req.PageSize,
            Data = data,
            NextPageKey = nextPageKey
        };
    }
}