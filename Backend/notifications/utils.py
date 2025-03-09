from twilio.rest import Client
from django.conf import settings

def send_sms_notification(to_phone, message):
    """Send SMS notification using Twilio"""
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    try:
        message = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to_phone
        )
        return message.sid  # Return message ID
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return None
