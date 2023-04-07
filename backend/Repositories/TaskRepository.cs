﻿using System.Net;
using System.Text.Json;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Contracts.Responses;
using Server.Mappers;
using Server.Startup;

namespace Server.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly IAmazonDynamoDB _client;

    private static readonly string TasksTableName =
        Environment.GetEnvironmentVariable(EnvVariables.TableName) ??
        throw new Exception(
            $"{nameof(EnvVariables.TableName)} env variable cannot be null");

    public TaskRepository(IAmazonDynamoDB client)
    {
        _client = client;
    }

    public async Task<TaskDto?> CreateAsync(CreateTaskReq req, string userId, CancellationToken ct = default)
    {
        var entity = req.ToTaskEntity();
        entity.UserId = userId;

        var taskAsJson = JsonSerializer.Serialize(entity, SerializationContext.Default.TaskEntity);
        var itemAsDoc = Document.FromJson(taskAsJson);
        var itemAsAttrib = itemAsDoc.ToAttributeMap();

        var createItemReq = new PutItemRequest
        {
            TableName = TasksTableName,
            Item = itemAsAttrib
        };

        var response = await _client.PutItemAsync(createItemReq, ct);

        if (response.HttpStatusCode != HttpStatusCode.OK)
            return null;

        return entity.ToTaskDto();
    }

    public async Task<TaskDto?> GetAsync(Guid id, string userId, CancellationToken ct = default)
    {
        var request = new GetItemRequest
        {
            TableName = TasksTableName,
            Key = new()
            {
                {"pk", new AttributeValue {S = id.ToString()}},
                {"sk", new AttributeValue {S = id.ToString()}},
            }
        };

        var response = await _client.GetItemAsync(request, ct);

        if (!response.IsItemSet)
            return null;

        var itemAsDoc = Document.FromAttributeMap(response.Item);
        return JsonSerializer.Deserialize(itemAsDoc.ToJson(), SerializationContext.Default.TaskEntity)?.ToTaskDto();
    }

    public async Task<TaskDto?> UpdateAsync(UpdateTaskReq req, string userId, CancellationToken ct = default)
    {
        var entity = req.ToTaskEntity();
        var taskAsJson = JsonSerializer.Serialize(entity, SerializationContext.Default.TaskEntity);
        var itemAsDoc = Document.FromJson(taskAsJson);
        var itemAsAttrib = itemAsDoc.ToAttributeMap();

        var updateItemReq = new PutItemRequest
        {
            TableName = TasksTableName,
            Item = itemAsAttrib
        };

        var response = await _client.PutItemAsync(updateItemReq, ct);

        if (response.HttpStatusCode != HttpStatusCode.OK)
            return null;

        return entity.ToTaskDto();
    }

    public async Task<bool> DeleteAsync(Guid id, string userId, CancellationToken ct = default)
    {
        var deleteItemReq = new DeleteItemRequest
        {
            TableName = TasksTableName,
            Key = new()
            {
                {"pk", new AttributeValue {S = id.ToString()}},
                {"sk", new AttributeValue {S = id.ToString()}}
            }
        };

        var response = await _client.DeleteItemAsync(deleteItemReq, ct);
        return response.HttpStatusCode == HttpStatusCode.OK;
    }

    public async Task<PaginatedRes<TaskDto>> ListAsync(PaginatedReq req, string userId, CancellationToken ct = default)
    {
        var scanReq = new ScanRequest
        {
            TableName = TasksTableName,
            Limit = req.PageSize
        };

        var response = await _client.ScanAsync(scanReq, ct);

        var tasks = new List<TaskDto>();

        foreach (var item in response.Items)
        {
            var itemAsDoc = Document.FromAttributeMap(item);
            var taskEntity = JsonSerializer.Deserialize(itemAsDoc.ToJson(), SerializationContext.Default.TaskEntity);

            if (taskEntity is not null)
                tasks.Add(taskEntity.ToTaskDto());
        }

        // TODO: improve pagination
        return new()
        {
            CurrentPage = req.Page,
            PageSize = req.PageSize,
            Data = tasks,
            TotalCount = 0,
            TotalPages = 0
        };
    }
}