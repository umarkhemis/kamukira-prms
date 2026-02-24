from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Setup PRMS: run migrations, load fixtures, and create superuser'

    def handle(self, *args, **options):
        self.stdout.write('Running migrations...')
        call_command('migrate', '--run-syncdb')

        self.stdout.write('Loading initial fixtures...')
        try:
            call_command('loaddata', 'initial_data')
            self.stdout.write(self.style.SUCCESS('Fixtures loaded successfully'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Could not load fixtures: {e}'))

        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            self.stdout.write('Creating admin superuser...')
            User.objects.create_superuser(
                username='admin',
                password='Admin@1234',
                email='admin@kamukira.ug',
                first_name='System',
                last_name='Administrator',
                role='admin',
                employee_id='EMP-ADMIN-001',
            )
            self.stdout.write(self.style.SUCCESS('Admin user created: admin / Admin@1234'))
        else:
            self.stdout.write('Admin user already exists, updating password...')
            admin = User.objects.get(username='admin')
            admin.set_password('Admin@1234')
            admin.is_staff = True
            admin.is_superuser = True
            admin.role = 'admin'
            admin.save()
            self.stdout.write(self.style.SUCCESS('Admin password reset to: Admin@1234'))

        self.stdout.write(self.style.SUCCESS('PRMS setup complete!'))
