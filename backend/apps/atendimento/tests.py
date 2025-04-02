from django.test import TestCase
from .models import Frequencia
from django.utils import timezone

from apps.academia.models import Aluno, Turma, Graduacao
from apps.contas.models import Instrutor

class BaseTest(TestCase):
    def setUp(self):
        self.instrutor = Instrutor.objects.create(
            username='admin',
            password='password',
            graduacao=None,
            contato='123456789',
            email='admin@example.com',
            email_confirmado=True
        )
        self.graduacao = Graduacao.objects.create(faixa='0')
        self.turma = Turma.objects.create(nome='Turma A', dias_da_semana='1', horario='10:00:00')
        self.aluno = Aluno.objects.create(
            nome='Aluno 1',
            data_nascimento='2000-01-01',
            contato='123456789',
            email='aluno1@example.com',
            turma=self.turma,
            graduacao=self.graduacao
        )

class FrequenciaModelTest(BaseTest):
    def setUp(self):
        super().setUp()  # Call the base setup
        self.frequencia = Frequencia.objects.create(
            data=timezone.now(),

            aluno_presente=self.aluno,
            turma=self.turma,
            instrutor=self.instrutor
        )

    def test_frequencia_creation(self):
        self.assertEqual(self.frequencia.aluno_presente.nome, 'Aluno 1')

    def test_frequencia_update(self):
        self.frequencia.data = timezone.now()

        self.frequencia.save()
        self.assertEqual(self.frequencia.data, timezone.now())

    def test_frequencia_deletion(self):
        self.frequencia.delete()
        self.assertFalse(Frequencia.objects.filter(aluno_presente=self.aluno).exists())
