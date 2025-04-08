from django.db import models
from django.utils import timezone
from apps.academia.models import Aluno, Turma
from apps.contas.models import Instrutor


class Aula(models.Model):
    data = models.DateTimeField(default=timezone.now, verbose_name='Data')
    alunos_presentes = models.ManyToManyField(Aluno, verbose_name='Alunos Presentes')  
    horario_inicio = models.TimeField(verbose_name='Horário de Início')
    horario_fim = models.TimeField(verbose_name='Horário de Fim')
    observacao = models.TextField(blank=True, null=True, verbose_name='Observação')
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, verbose_name='Turma')
    instrutores = models.ManyToManyField(Instrutor, verbose_name='Instrutores')  

    def __str__(self):
        return f'{self.data} - {self.turma} - {self.aluno_presente.nome}'
    
    class Meta:
        verbose_name = 'Aula'
        verbose_name_plural = 'Aulas'
        ordering = ['-data']

