from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.mail import send_mail
from .serializers import ContactSerializer
import logging
logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class ContactAPIView(APIView):
    def post(self, request, format=None):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            subject = data.get('subject')
            message = f"Nom : {data.get('name')}\nEmail : {data.get('email')}\n\n{data.get('message')}"
            from_email = "steven.zenadi@orange.fr"
            recipient_list = ['steven.zenadi@orange.fr']

            try:
                send_mail(subject, message, from_email, recipient_list)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Email envoyé avec succès.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
