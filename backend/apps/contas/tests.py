from django.test import TestCase
from .models import Instrutor

class InstrutorModelTest(TestCase):
    def setUp(self):
        # Create an instance of the Instrutor model
        self.instrutor = Instrutor.objects.create(
            username='admin',
            password='password',
            graduacao=None,  # This will be set later
            contato='123456789',
            email='admin@example.com',
            email_confirmado=True
        )

    def test_instrutor_creation(self):
        self.assertEqual(self.instrutor.username, 'admin')
        self.assertEqual(self.instrutor.contato, '123456789')

    def test_instrutor_update(self):
        self.instrutor.contato = '987654321'
        self.instrutor.save()
        self.assertEqual(self.instrutor.contato, '987654321')

    def test_instrutor_deletion(self):
        self.instrutor.delete()
        self.assertFalse(Instrutor.objects.filter(username='admin').exists())
