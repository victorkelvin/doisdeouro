from django.db import models
from django.contrib.auth.models import AbstractUser

class Instrutor(AbstractUser):
    graduacao = models.ForeignKey('academia.Graduacao', on_delete=models.SET_NULL, null=True, verbose_name='Graduação')
    contato = models.CharField(max_length=20, blank=True, verbose_name='Contato')
    email_confirmado = models.BooleanField(default=False, verbose_name='Email Confirmado')

    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'Instrutor'
        verbose_name_plural = 'Instrutores'
