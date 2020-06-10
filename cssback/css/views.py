from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
import json
from .models import Menu,UserProfile,Sportif
from django.views.generic import TemplateView
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

class Login(TemplateView):
	def get(self,request,username,password):
		user = authenticate(username=username, password=password)
		if not user:
		    return JsonResponse({'error': 'Invalid Credentials'})
		token, _ = Token.objects.get_or_create(user=user)
		return JsonResponse({'token': token.key ,'super_user': user.is_superuser , "permissions": user.userprofile.permissions} )


class WhoAmI(TemplateView):
	def get(self,request):
		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})

		return JsonResponse({'error':'None' ,'super_user': user.is_superuser , "permissions": user.userprofile.permissions})

class AddMenu(TemplateView):
	def get(self,request,menu_name,parent_id=""):
		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})
		if (not user.is_superuser ):
			return JsonResponse({'error': 'You need be super user'})

		menu=Menu.objects.create(menu_name=menu_name,parent_id=parent_id)
		return JsonResponse({"id":menu.id},safe=False)


class DeleteMenu(TemplateView):
	#TODO check if users
	def get(self,request,menu_id):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})
		if (not user.is_superuser ):
			return JsonResponse({'error': 'You need be super user'})

		fiches=Sportif.objects.filter(categorie=menu_id)
		if(len(fiches)!=0):
			return JsonResponse({"error":"Only empty menus can be deleted , delete fiches first"},safe=False)
		menu_list=Menu.objects.filter(parent_id=menu_id)
		if(len(menu_list)!=0):
			return JsonResponse({"error":"Only final menus can be deleted , delete childs first"},safe=False)
		else:
			Menu.objects.get(id=menu_id).delete()
			return JsonResponse({"id":menu_id},safe=False)
		

class GetMenus(TemplateView):
	"""
	Get Menu structure
	"""
	def get(self,request):
		result=[]
		menu_list=Menu.objects.filter(parent_id='')
		for x in menu_list:
			menu={}
			menu["name"]=x.menu_name
			menu["type"]="final"
			menu["id"]=x.id
			menu["content"]=[]
			result.append(menu)
		for menu in result:
			if len(Menu.objects.filter(parent_id=menu["id"])) != 0:
				submenu_list=Menu.objects.filter(parent_id=menu["id"])
				for x in submenu_list:
					submenu={}
					submenu["name"]=x.menu_name
					submenu["type"]="final"
					submenu["id"]=x.id
					submenu["content"]=[]
					menu["content"].append(submenu)
		for menu in result:
			if len(menu["content"]) != 0:
				for sub in menu["content"]:
					submenu_list=Menu.objects.filter(parent_id=sub["id"])
					for x in submenu_list:
						submenu={}
						submenu["name"]=x.menu_name
						submenu["type"]="final"
						submenu["id"]=x.id
						submenu["content"]=[]
						sub["content"].append(submenu)

		for menu in result:
			if len(menu["content"]) != 0:
				menu["type"]="menu"
				for submenu  in menu["content"]:
					if len(submenu["content"]) != 0:
						submenu["type"]="menu"					
		return JsonResponse(result,safe=False)



class GetMenu(TemplateView):
	"""
	Get Menu structure
	"""
	def get(self,request,menu_id):
		menu_obj=Menu.objects.get(id=menu_id)
		menu={}
		menu["name"]=menu_obj.menu_name
		menu["id"]=menu_obj.id
		menu["parent_id"]=menu_obj.parent_id
		return JsonResponse(menu,safe=False)




class AddUser(TemplateView):
	#TODO check if users
	def get(self,request,fname,lname,tel,mobile,fonction,mail,password,permissions=""):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})
		if (not user.is_superuser ):
			return JsonResponse({'error': 'You need be super user'})

		try:

			new_user=User.objects.create_user(first_name=fname,last_name=lname,email=mail,username=mail,password=password)
			new_user.userprofile.permissions=permissions
			new_user.userprofile.fonction=fonction
			new_user.userprofile.tel=tel
			new_user.userprofile.mobile=mobile
			new_user.userprofile.save()
			return JsonResponse({"id":new_user.id},safe=False)

		except:
			return JsonResponse({"Error":"already exists"},safe=False)
		

class UpdateUser(TemplateView):
	#TODO check if users
	def get(self,request,fname,lname,tel,mobile,fonction,mail,password,permissions=""):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})
		if (not user.is_superuser ):
			return JsonResponse({'error': 'You need be super user'})

		try:
			user_object = User.objects.filter(username=mail).last()
			user_object.fname=fname
			user_object.lname=lname
			user_object.userprofile.fonction=fonction
			user_object.mail=mail
			user_object.username=mail
			user_object.userprofile.permissions=permissions
			user_object.userprofile.tel=tel
			user_object.userprofile.mobile=mobile
			user_object.userprofile.save()
			if(password!="no"):
				user_object.set_password(password)
			user_object.save()
	
			return JsonResponse({"id":user_object.id},safe=False)

		except:
			return JsonResponse({"Error":"Don't exists"},safe=False)
		


class DeleteUser(TemplateView):
	#TODO check if users
	def get(self,request,username):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})
		if (not user.is_superuser ):
			return JsonResponse({'error': 'You need be super user'})

		

		user_object = User.objects.get(id=username)
		if user_object.is_superuser:
			return JsonResponse({"Error":"Vous ne pouvez pas supprimer un super utilisateur"},safe=False)
		user_object.delete()
		return JsonResponse({"Error":"None"},safe=False)


class GetUsers(TemplateView):
	#TODO check if users
	def get(self,request):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})

		result=[]
		users_object = User.objects.all()
		for user_object in users_object:
			user={}
			user["id"]=user_object.id
			user["first_name"]=user_object.first_name
			user["last_name"]=user_object.last_name
			user["super"]=user_object.is_superuser
			user["mail"]=user_object.email
			userprofile=UserProfile.objects.filter(user_id=user_object.id).last()
			user["permissions"]=userprofile.permissions
			user["fonction"]=userprofile.fonction
			user["tel"]=userprofile.tel
			user["mobile"]=userprofile.mobile
			result.append(user)


			
	
	
		return JsonResponse(result,safe=False)




class GetUser(TemplateView):
	#TODO check if users
	def get(self,request,uid):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})

		try:
			user_object = User.objects.get(id=uid)
			
			user={}
			user["id"]=user_object.id
			user["first_name"]=user_object.first_name
			user["last_name"]=user_object.last_name
			user["super"]=user_object.is_superuser
			user["mail"]=user_object.email
			userprofile=UserProfile.objects.filter(user_id=user_object.id).last()
			user["permissions"]=userprofile.permissions
			user["fonction"]=userprofile.fonction
			user["tel"]=userprofile.tel
			user["mobile"]=userprofile.mobile
				
	
	
				
		
		
			return JsonResponse(user,safe=False)
		except:
			return JsonResponse({"Error":"User inexistant"},safe=False)


class AddSportif(TemplateView):
	def get(self,request):
		return JsonResponse({"Error":"Only post"},safe=False)

	def post(self,request):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})

		userprofile=UserProfile.objects.filter(user_id=user.id).last()
		
		body_unicode = request.body.decode('utf-8')
		data = json.loads(body_unicode)
		
		if(data["categorie"]==None or data["categorie"]=="" ):
			return JsonResponse({"Error":"La categorie est obligatoire"},safe=False)

		if ((not user.is_superuser ) and data["categorie"] not in userprofile.permissions.split(";") ):
			return JsonResponse({'Error': 'You need be have permission to do this'})


		else:
			sportif=Sportif.objects.create(nom=data["first_name"]
				,prenom=data["last_name"]
				,mobile=data["mobile"]
				,dob=data["dob"]
				,nationalite=data["nationalite"]
				,fiche=data["fiche"]
				,poste=data["poste"]
				,categorie=data["categorie"])
			return JsonResponse({"Error":"None","id":sportif.id},safe=False)
		


class GetSportifs(TemplateView):
	
	def get(self,request,categorie="all"):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'Error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		userprofile=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
			userprofile=UserProfile.objects.filter(user_id=user.id).last()
		except:
			return JsonResponse({'Error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'Error': 'You need be valid user'})
		if(categorie=='all' and not user.is_superuser):
			return JsonResponse({'Error': 'You need be super user to see all sportifs'})
		if (not user.is_superuser) and (categorie!='all' and categorie not in userprofile.permissions.split(";") ):
			return JsonResponse({'Error': 'You cannot access to this categorie'})
		


		result=[]
		users_object=[]
		if categorie=="all":
			users_object = Sportif.objects.all()
		else:
			users_object = Sportif.objects.filter(categorie=categorie)
		for user_object in users_object:
			user={}
			menu_obj=Menu.objects.get(id=user_object.categorie)
			user["id"]=user_object.id
			user["nom"]=user_object.nom
			user["prenom"]=user_object.prenom
			user["mobile"]=user_object.mobile
			user["fiche"]=user_object.fiche.replace(" ", "+")
			user["dob"]=user_object.dob
			user["nationalite"]=user_object.nationalite
			user["poste"]=user_object.poste
			user["updated"]=user_object.updated
			user["categorie"]=user_object.categorie
			user["categorie_name"]=menu_obj.menu_name
			result.append(user)


			
	
	
		return JsonResponse(result,safe=False)




class GetSportif(TemplateView):
	#TODO check if users
	def get(self,request,username):
		user_object = Sportif.objects.filter(id=username).last()
		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'Error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		userprofile=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
			userprofile=UserProfile.objects.filter(user_id=user.id).last()
		except:
			return JsonResponse({'Error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'Error': 'You need be valid user'})
		if(not user.is_superuser and user_object.categorie not in userprofile.permissions.split(";") ):
			return JsonResponse({'Error': 'You cannot access to this user'})
		
		
			
		try:
			user={}
			menu_obj=Menu.objects.get(id=user_object.categorie)
			user["id"]=user_object.id
			user["nom"]=user_object.nom
			user["prenom"]=user_object.prenom
			user["mobile"]=user_object.mobile
			user["fiche"]=user_object.fiche.replace(" ", "+")
			user["dob"]=user_object.dob
			user["nationalite"]=user_object.nationalite
			user["poste"]=user_object.poste
			user["updated"]=user_object.updated
			user["categorie"]=user_object.categorie
			user["categorie_name"]=menu_obj.menu_name
			return JsonResponse(user,safe=False)
		except:
			return JsonResponse({'Error': 'inexistant'})



class DeleteSportif(TemplateView):
	#TODO check if users
	def get(self,request,username):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})
		if (not user.is_superuser ):
			return JsonResponse({'error': 'You need be super user'})

		

		
		try:
			user_object = Sportif.objects.get(id=username)
			user_object.delete()
		except:
			return JsonResponse({"Error":"inexistant"},safe=False)
		return JsonResponse({"Error":"None"},safe=False)


class UpdateSportif(TemplateView):
	def get(self,request):
		return JsonResponse({"Error":"Only post"},safe=False)

	def post(self,request):

		token = request.META.get('HTTP_AUTHORIZATION')
		if (token == None):
			return JsonResponse({'error': 'You need to login'})
		token = token[token.index(" ")+1:]
		user=None
		try:
			user=User.objects.get(id=Token.objects.get(key=token).user_id)
		except:
			return JsonResponse({'error': 'Cannot validate token'})
		if user==None:
			return JsonResponse({'error': 'You need be valid user'})

		#if (not user.is_superuser ): #MAYBE IN TODO
		#	return JsonResponse({'error': 'You need be super user'})

		

		#print(request.body["id"])
		body_unicode = request.body.decode('utf-8')
		data = json.loads(body_unicode)
		

		#data = json.loads(list(dict(request.POST).items())[0][0])
		#print((data))
		if(data["categorie"]==None or data["categorie"]=="" ):
			return JsonResponse({"Error":"La categorie est obligatoire"},safe=False)


		else:
			try:
				sportif=Sportif.objects.filter(id=data["id"]).last()
				sportif.prenom=data["last_name"]
				sportif.nom=data["first_name"]
				sportif.mobile=data["mobile"]
				sportif.dob=data["dob"]
				sportif.nationalite=data["nationalite"]
				sportif.fiche=data["fiche"]
				sportif.poste=data["poste"]
				sportif.categorie=data["categorie"]
				sportif.save()
				return JsonResponse({"Error":"None","id":sportif.id},safe=False)
			except:
				return JsonResponse({"Error":"inexistant"},safe=False)
		




