using Server.Contracts.Entities;

namespace Server.Contracts.Dtos;

public class TaskDto
{
    public string Id { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public DateTime UpdatedAt { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateOnly? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public bool? IsImportant { get; set; }
    public TaskPriorityEnum Priority { get; set; }
}