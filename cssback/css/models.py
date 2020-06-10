from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

class Menu(models.Model):
	menu_name = models.CharField(max_length=100, null=False)
	parent_id = models.CharField(max_length=100,)


class UserProfile(models.Model):
    #required by the auth model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    permissions = models.CharField(max_length=100,default="")
    fonction = models.CharField(max_length=100,default="")
    tel = models.CharField(max_length=100,default="")
    mobile = models.CharField(max_length=100,default="")
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance,permissions="")
    instance.userprofile.save()


class Sportif(models.Model):
	nom= models.CharField(max_length=100,default="")
	prenom= models.CharField(max_length=100,default="")
	mobile=models.CharField(max_length=100,default="")
	nationalite=models.CharField(max_length=100,default="")
	dob=models.CharField(max_length=100,default="")
	poste=models.CharField(max_length=100,default="")
	fiche=models.TextField(default="")
	categorie=models.CharField(max_length=100,default="")
	updated = models.DateTimeField(default=timezone.now)
	def update(self, *args, **kwargs):
		kwargs.update({'updated': timezone.now})
		super().update(*args, **kwargs)
		return self