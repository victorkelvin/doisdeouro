from django.db import models

#Tabela de referência Graduações
class Graduacao(models.Model):
    FAIXAS = [
    ('Branca'),
    ('Cinza/Branca'),
    ('Cinza'),
    ('Cinza/Preta'),
    ('Amarela/Branca'),
    ('Amarela'),
    ('Amarela/Preta'),
    ('Laranja/Branca'),
    ('Laranja'),
    ('Laranja/Preta'),
    ( 'Verde/Branca'),
    ( 'Verde'),
    ( 'Verde/Preta'),
    ( 'Azul'),
    ( 'Roxa'),
    ( 'Marrom'),
    ( 'Preta'),
    ( 'Vermelha/Preta'),
    ( 'Vermelha/Branca'),
    ( 'Vermelha'),
    ]

    faixa = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.faixa
    

    class Meta:
        verbose_name = 'Graduação'
        verbose_name_plural = 'Graduações'
        ordering = ['faixa']

#Tabela de Referencia
class DiaSemana(models.Model):
    dia = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.dia


#Turmas
class Turma(models.Model):
    DIAS_SEMANA = [
        ('1', 'Segunda-feira'),
        ('2', 'Terça-feira'),
        ('3', 'Quarta-feira'),
        ('4', 'Quinta-feira'),
        ('5', 'Sexta-feira'),
        ('6', 'Sábado'),
        ('7', 'Domingo') 
    ]

    nome = models.CharField(max_length=100, verbose_name='Turma')
    dias_da_semana = models.ManyToManyField(DiaSemana, blank=True)
    horario = models.TimeField(verbose_name='Horário')

    def __str__(self):
        return f"{self.nome} - {self.dias_da_semana}"
    
    class Meta:
        verbose_name = 'Turma'
        verbose_name_plural = 'Turmas'


#Alunos
class Aluno(models.Model):
    nome = models.CharField(max_length=200, verbose_name='Nome')
    data_nascimento = models.DateField(verbose_name='Data de Nascimento')
    ativo = models.BooleanField(default=True, verbose_name='Ativo')
    data_cadastro = models.DateTimeField(auto_now_add=True, verbose_name='Data de Cadastro')
    contato = models.CharField(max_length=20, verbose_name='Contato', blank=True)
    email = models.EmailField(verbose_name='Email', blank=True)
    turma = models.ForeignKey('Turma', on_delete=models.CASCADE, verbose_name='Turma', null=True)
    graduacao = models.ForeignKey('Graduacao', on_delete=models.SET_NULL, null=True, verbose_name='Graduação')
    foto = models.ImageField(upload_to='alunos/', null=True, blank=True, verbose_name='Foto')

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = 'Aluno'
        verbose_name_plural = 'Alunos'
        ordering = ['nome']
