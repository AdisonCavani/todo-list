using System.Text.Json.Serialization;
using Amazon.Lambda.APIGatewayEvents;
using Server.Contracts.Dtos;
using Server.Contracts.Entities;
using Server.Contracts.Requests;
using Server.Contracts.Responses;

namespace Server;

// Dtos
[JsonSerializable(typeof(HealthCheckDto))]
[JsonSerializable(typeof(LabelDto))]
[JsonSerializable(typeof(TaskDto))]

// Entities
[JsonSerializable(typeof(LabelEntity))]
[JsonSerializable(typeof(TaskEntity))]

// Requests
[JsonSerializable(typeof(CreateLabelReq))]
[JsonSerializable(typeof(CreateTaskReq))]
[JsonSerializable(typeof(PaginatedReq))]
[JsonSerializable(typeof(UpdateLabelReq))]
[JsonSerializable(typeof(UpdateTaskReq))]

// Responses
[JsonSerializable(typeof(HealthCheckRes))]
[JsonSerializable(typeof(PaginatedRes<LabelDto>))]
[JsonSerializable(typeof(PaginatedRes<TaskDto>))]
[JsonSerializable(typeof(HttpValidationProblemDetails))]

// AWS Lambda
[JsonSerializable(typeof(APIGatewayHttpApiV2ProxyRequest))]
[JsonSerializable(typeof(APIGatewayHttpApiV2ProxyResponse))]
public partial class SerializationContext : JsonSerializerContext
{
}