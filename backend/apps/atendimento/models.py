from django.db import models
from django.utils import timezone
from apps.academia.models import Aluno, Turma
from apps.contas.models import Instrutor


class Frequencia(models.Model):
    data = models.DateTimeField(default=timezone.now, verbose_name='Data')
    aluno_presente = models.ForeignKey(Aluno, on_delete=models.CASCADE, verbose_name='Aluno presente')

    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, verbose_name='Turma')
    instrutor = models.ManyToManyField(Instrutor)

    def __str__(self):
        return f'{self.aluno_presente.nome} - {self.turma} - {self.instrutor}'
    
    class Meta:
        verbose_name = 'Frequência'
        verbose_name_plural = 'Frequências'
        unique_together = ['data', 'aluno_presente', 'turma']