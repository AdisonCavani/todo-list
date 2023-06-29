using Amazon.DynamoDBv2.Model;
using Server.Contracts.Dtos;
using Server.Contracts.Entities;
using Server.Contracts.Requests;

namespace Server.Mappers;

public static class LabelMapper
{
    public const string Pk = "pk";
    public const string Sk = "sk";
    
    public static AttributeValue GetPk(string userId) => new() {S = $"USER#{userId}"};
    public static AttributeValue GetSk(Guid labelId) => new() {S = $"LABEL#{labelId.ToString()}"};

    public static LabelDto ToLabelDto(this LabelEntity taskEntity)
    {
        return new()
        {
            Id = taskEntity.Id,
            Name = taskEntity.Name
        };
    }

    public static LabelEntity ToLabelEntity(this CreateLabelReq req, string userId)
    {
        return new()
        {
            Id = Guid.NewGuid().ToString(),
            Name = req.Name,
            UserId = userId
        };
    }

    public static LabelEntity ToLabelEntity(this UpdateLabelReq req, string userId)
    {
        return new()
        {
            Id = req.Id.ToString(),
            Name = req.Name,
            UserId = userId,
        };
    }
}