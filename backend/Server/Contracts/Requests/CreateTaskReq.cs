using Server.Contracts.Entities;

namespace Server.Contracts.Requests;

public class CreateTaskReq
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateOnly? DueDate { get; set; }
    public TaskPriorityEnum Priority { get; set; }
}