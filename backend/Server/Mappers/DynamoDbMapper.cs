using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;

namespace Server.Mappers;

public static class DynamoDbMapper
{
    public static Dictionary<string, AttributeValue> ToDict<T>(T item)
    {
        var itemAsJson = JsonSerializer.Serialize(item, SerializationContext.Default.TaskEntity);
        var itemAsDoc = Document.FromJson(itemAsJson);
        var itemAsAttrib = itemAsDoc.ToAttributeMap();

        return itemAsAttrib;
    }

    public static TItem? FromDict<TItem>(Dictionary<string, AttributeValue> item, JsonTypeInfo<TItem> jsonTypeInfo)
    {
        var itemAsDoc = Document.FromAttributeMap(item);
        var value = JsonSerializer.Deserialize(itemAsDoc.ToJson(), jsonTypeInfo);

        return value;
    }
}