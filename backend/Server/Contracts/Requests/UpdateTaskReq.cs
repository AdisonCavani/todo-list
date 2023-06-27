using Server.Contracts.Entities;

namespace Server.Contracts.Requests;

public class UpdateTaskReq
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateOnly? DueDate { get; set; }
    public bool? IsCompleted { get; set; }
    public bool? IsImportant { get; set; }
    public TaskPriorityEnum Priority { get; set; }
}