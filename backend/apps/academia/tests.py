from django.test import TestCase
from .models import Graduacao, Turma, Aluno
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

class GraduacaoModelTest(BaseTest):
    def setUp(self):
        super().setUp()  # Call the base setup
        self.graduacao = Graduacao.objects.create(faixa='0')

    def test_graduacao_creation(self):
        self.assertEqual(self.graduacao.faixa, '0')

    def test_graduacao_update(self):
        self.graduacao.faixa = '1'
        self.graduacao.save()
        self.assertEqual(self.graduacao.faixa, '1')

    def test_graduacao_deletion(self):
        self.graduacao.delete()
        self.assertFalse(Graduacao.objects.filter(faixa='0').exists())

class TurmaModelTest(BaseTest):
    def setUp(self):
        super().setUp()  # Call the base setup
        self.graduacao = Graduacao.objects.create(faixa='0')
        self.turma = Turma.objects.create(nome='Turma A', dias_da_semana='1', horario='10:00:00')

    def test_turma_creation(self):
        self.assertEqual(self.turma.nome, 'Turma A')

    def test_turma_update(self):
        self.turma.nome = 'Turma B'
        self.turma.save()
        self.assertEqual(self.turma.nome, 'Turma B')

    def test_turma_deletion(self):
        self.turma.delete()
        self.assertFalse(Turma.objects.filter(nome='Turma A').exists())

class AlunoModelTest(BaseTest):
    def setUp(self):
        super().setUp()  # Call the base setup
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

    def test_aluno_creation(self):
        self.assertEqual(self.aluno.nome, 'Aluno 1')

    def test_aluno_update(self):
        self.aluno.nome = 'Aluno 2'
        self.aluno.save()
        self.assertEqual(self.aluno.nome, 'Aluno 2')

    def test_aluno_deletion(self):
        self.aluno.delete()
        self.assertFalse(Aluno.objects.filter(nome='Aluno 1').exists())
