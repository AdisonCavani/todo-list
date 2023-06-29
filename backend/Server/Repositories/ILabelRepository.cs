using Server.Contracts.Dtos;
using Server.Contracts.Requests;
using Server.Contracts.Responses;

namespace Server.Repositories;

public interface ILabelRepository
{
    Task<LabelDto?> CreateAsync(CreateLabelReq req, string userId, CancellationToken ct = default);
    Task<LabelDto?> GetAsync(Guid id, string userId, CancellationToken ct = default);
    Task<LabelDto?> UpdateAsync(UpdateLabelReq req, string userId, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, string userId, CancellationToken ct = default);
    Task<PaginatedRes<LabelDto>> ListAsync(PaginatedReq req, string userId, CancellationToken ct = default);
}