using Amazon.DynamoDBv2.Model;
using Server.Contracts.Dtos;
using Server.Contracts.Entities;
using Server.Contracts.Requests;

namespace Server.Mappers;

public static class TaskMapper
{
    public const string Pk = "pk";
    public const string Sk = "sk";

    public static AttributeValue GetPk(string userId) => new() {S = $"USER#{userId}"};
    public static AttributeValue GetSk(Guid taskId) => new() {S = $"TASK#{taskId.ToString()}"};

    public static TaskDto ToTaskDto(this TaskEntity taskEntity)
    {
        return new()
        {
            Id = taskEntity.Id,
            UserId = taskEntity.UserId,
            UpdatedAt = taskEntity.UpdatedAt,
            Title = taskEntity.Title,
            Description = taskEntity.Description,
            DueDate = taskEntity.DueDate,
            IsCompleted = taskEntity.IsCompleted,
            IsImportant = taskEntity.IsImportant,
            Priority = taskEntity.Priority
        };
    }

    public static TaskEntity ToTaskEntity(this CreateTaskReq req, string userId)
    {
        return new()
        {
            Id = Guid.NewGuid().ToString(),
            Title = req.Title,
            Description = req.Description,
            DueDate = req.DueDate,
            UpdatedAt = DateTime.UtcNow,
            UserId = userId,
            Priority = req.Priority
        };
    }

    public static TaskEntity ToTaskEntity(this UpdateTaskReq req, string userId)
    {
        return new()
        {
            Id = req.Id.ToString(),
            Title = req.Title,
            Description = req.Description,
            DueDate = req.DueDate,
            IsCompleted = req.IsCompleted ?? false,
            IsImportant = req.IsImportant ?? false,
            UpdatedAt = DateTime.UtcNow,
            UserId = userId,
            Priority = req.Priority
        };
    }
}