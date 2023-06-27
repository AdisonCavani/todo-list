using System.Text.Json.Serialization;

namespace Server.Contracts.Entities;

public class TaskEntity
{
    [JsonPropertyName("pk")] public string Pk => $"USER#{UserId}";
    [JsonPropertyName("sk")] public string Sk => $"TASK#{Id}";
    [JsonPropertyName("id")] public string Id { get; set; } = default!;
    [JsonPropertyName("user_id")] public string UserId { get; set; } = default!;
    [JsonPropertyName("updated_at")] public DateTime UpdatedAt { get; set; }
    [JsonPropertyName("title")] public string Title { get; set; } = default!;
    [JsonPropertyName("description")] public string? Description { get; set; }
    [JsonPropertyName("due_date")] public DateOnly? DueDate { get; set; }
    [JsonPropertyName("is_completed")] public bool IsCompleted { get; set; }
    [JsonPropertyName("is_important")] public bool IsImportant { get; set; }
    [JsonPropertyName("priority")] public TaskPriorityEnum Priority { get; set; }
}