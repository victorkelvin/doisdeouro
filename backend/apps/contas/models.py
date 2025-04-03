from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class InstrutorManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('O username é obrigatório')
        
        user = self.model(username=username, **extra_fields)
        user.set_password(password)  # Criptografa a senha automaticamente
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(username, password, **extra_fields)

class Instrutor(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(blank=True, null=True)  
    nome = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    # Seus campos específicos
    graduacao = models.ForeignKey('academia.Graduacao', on_delete=models.SET_NULL, null=True, verbose_name='Graduação')
    contato = models.CharField(max_length=20, blank=True, verbose_name='Contato')
    foto = models.ImageField(upload_to='instrutores/', null=True, blank=True, verbose_name='Foto')
    
    objects = InstrutorManager()

    USERNAME_FIELD = 'username'  # Campo usado para login
    REQUIRED_FIELDS = []  # Não são necessários outros campos obrigatórios além do USERNAME_FIELD
    
    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'Instrutor'
        verbose_name_plural = 'Instrutores'