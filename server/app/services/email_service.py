import smtplib
from email.message import EmailMessage

from flask import current_app


class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str) -> None:
        mail_server = current_app.config.get("MAIL_SERVER")
        mail_port = current_app.config.get("MAIL_PORT")
        mail_use_tls = current_app.config.get("MAIL_USE_TLS")
        mail_username = current_app.config.get("MAIL_USERNAME")
        mail_password = current_app.config.get("MAIL_PASSWORD")
        mail_default_sender = current_app.config.get("MAIL_DEFAULT_SENDER")

        if not mail_server:
            raise ValueError("MAIL_SERVER is not configured.")
        if not mail_port:
            raise ValueError("MAIL_PORT is not configured.")
        if not mail_username:
            raise ValueError("MAIL_USERNAME is not configured.")
        if not mail_password:
            raise ValueError("MAIL_PASSWORD is not configured.")
        if not mail_default_sender:
            raise ValueError("MAIL_DEFAULT_SENDER is not configured.")

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = mail_default_sender
        message["To"] = to_email
        message.set_content(body)

        with smtplib.SMTP(mail_server, mail_port, timeout=15) as smtp:
            if mail_use_tls:
                smtp.starttls()

            smtp.login(mail_username, mail_password)
            smtp.send_message(message)

    @staticmethod
    def send_registration_confirmation(to_email: str, first_name: str) -> None:
        subject = "Uspešna registracija"
        body = f"""Zdravo {first_name},

Uspešno ste kreirali nalog na Gym Platform aplikaciji.

Sada možete da se prijavite i koristite aplikaciju za:
- praćenje treninga
- unos ishrane
- praćenje napretka

Pozdrav,
Gym Platform tim
"""
        EmailService.send_email(
            to_email=to_email,
            subject=subject,
            body=body,
        )