namespace Server.Contracts.Requests;

public class UpdateLabelReq
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
}