from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field, OpenApiExample


class OllamaRequestSerializer(serializers.Serializer):
    """
    Serializer for Ollama API requests
    """
    model = serializers.CharField(
        max_length=100,
        help_text="The name of the Ollama model to use (e.g., 'llama2', 'mistral')"
    )
    prompt = serializers.CharField(
        help_text="The prompt to send to the model"
    )
    stream = serializers.BooleanField(
        default=True,
        help_text="Whether to stream the response (default: True)"
    )
    options = serializers.DictField(
        required=False,
        help_text="Additional options for the model (temperature, top_p, etc.)"
    )


class OllamaResponseSerializer(serializers.Serializer):
    """
    Serializer for Ollama API responses
    """
    model = serializers.CharField(
        help_text="The name of the model used"
    )
    created_at = serializers.CharField(
        help_text="Timestamp when the response was created"
    )
    response = serializers.CharField(
        help_text="The generated response from the model"
    )
    done = serializers.BooleanField(
        help_text="Whether the response is complete"
    )
    context = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="Context tokens for the response"
    )
    total_duration = serializers.IntegerField(
        required=False,
        help_text="Total duration of the generation in nanoseconds"
    )
    load_duration = serializers.IntegerField(
        required=False,
        help_text="Time taken to load the model in nanoseconds"
    )
    prompt_eval_duration = serializers.IntegerField(
        required=False,
        help_text="Time taken to evaluate the prompt in nanoseconds"
    )
    eval_duration = serializers.IntegerField(
        required=False,
        help_text="Time taken to generate the response in nanoseconds"
    ) 