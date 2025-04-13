# contact/serializers.py

from rest_framework import serializers

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=150, default="IMPORTANT")
    message = serializers.CharField()
