using System.Text.Json.Serialization;

namespace Server.Contracts.Entities;

public class LabelEntity
{
    [JsonPropertyName("pk")] public string Pk => $"USER#{UserId}";
    [JsonPropertyName("sk")] public string Sk => $"LABEL#{Id}";
    [JsonPropertyName("id")] public string Id { get; set; } = default!;
    [JsonPropertyName("user_id")] public string UserId { get; set; } = default!;
    [JsonPropertyName("name")] public string Name { get; set; } = default!;
}