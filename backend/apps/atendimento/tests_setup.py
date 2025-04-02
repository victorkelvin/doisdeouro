from django.core.management import call_command
from django.db import transaction
from apps.academia.models import Aluno, Turma, Graduacao
from apps.contas.models import Instrutor

def populate_database():
    # Create Graduacao
    graduacao = Graduacao.objects.create(faixa='0')  # Example valid faixa

    # Create Turma
    turma = Turma.objects.create(nome='Turma Teste', dias_da_semana='1', horario='10:00:00')  # Example valid data

    # Create Instrutor
    instrutor = Instrutor.objects.create(username='instrutor_teste', password='testpass')

    # Create Aluno
    aluno = Aluno.objects.create(
        nome='Aluno Teste',
        data_nascimento='2000-01-01',  # Example valid date
        contato='1234567890',           # Example valid contact
        email='aluno@test.com',         # Example valid email
        turma=turma,
        graduacao=graduacao
    )



    return {
        'aluno': aluno,
        'turma': turma,
        'instrutor': instrutor,
        'graduacao': graduacao
    }


def setup_test_data():
    populate_database()
