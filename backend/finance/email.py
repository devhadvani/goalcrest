# myapp/email.py

from djoser.email import ActivationEmail
from .tasks import send_email_async
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse


class CustomActivationEmail(ActivationEmail):
    def send(self, to=None):
        context = self.get_context_data()
        to = to or [self.to[0]]
        user = context['user']
        
        # Generate activation URL
        current_site = get_current_site(self.request)
        protocol = 'https' if self.request.is_secure() else 'http'
        domain = current_site.domain
        print("domain",domain)
        uid = context['uid']
        token = context['token']

        domain = current_site.domain.split(':')[0]  # This will remove the port if it exists
        activation_url = f"{protocol}://{domain}:3000/activate/{uid}/{token}/"
        # activation_url = f"{protocol}://localhost:3000/activate/{uid}/{token}/"
        
        email_body = f"""
        Hello {user.first_name or 'User'},

        Thank you for registering at GoalCrest! Please activate your account using the link below:

        {activation_url}

        If you did not register, please disregard this email.

        Best regards,
        The GoalCrest Team
        """
        
        send_email_async.delay(
            subject=self.subject,
            body=email_body,
            to=to
        )

