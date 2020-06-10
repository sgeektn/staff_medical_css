from django.contrib import admin
from django.urls import path
from css import views

urlpatterns = [
    path('menu/getAll', views.GetMenus.as_view()),    
    path('menu/get/<str:menu_id>', views.GetMenu.as_view()),
    path('menu/add/<str:menu_name>/<str:parent_id>', views.AddMenu.as_view()),
    path('menu/add/<str:menu_name>', views.AddMenu.as_view()),
    path('menu/delete/<str:menu_id>', views.DeleteMenu.as_view()),
    path('login/<str:username>/<str:password>', views.Login.as_view()),
    path('whoami', views.WhoAmI.as_view()),
    path('user/add/<str:fname>/<str:lname>/<str:tel>/<str:mobile>/<str:fonction>/<str:mail>/<str:password>/<str:permissions>', views.AddUser.as_view()),
    path('user/add/<str:fname>/<str:lname>/<str:tel>/<str:mobile>/<str:fonction>/<str:mail>/<str:password>/', views.AddUser.as_view()),
  	path('user/delete/<str:username>', views.DeleteUser.as_view()),
    path('user/edit/<str:fname>/<str:lname>/<str:tel>/<str:mobile>/<str:fonction>/<str:mail>/<str:password>/<str:permissions>', views.UpdateUser.as_view()),
    path('user/edit/<str:fname>/<str:lname>/<str:tel>/<str:mobile>/<str:fonction>/<str:mail>/<str:password>/', views.UpdateUser.as_view()),
    path('user/getAll', views.GetUsers.as_view()),
    path('user/get/<str:uid>', views.GetUser.as_view()),
    path('sportif/add', views.AddSportif.as_view(), name= 'AddSportif'),
    path('sportif/getAll', views.GetSportifs.as_view(), name= 'AddSportif1'),
    path('sportif/getAll/<str:categorie>', views.GetSportifs.as_view(), name= 'AddSportif2'),
    path('sportif/get/<str:username>', views.GetSportif.as_view(), name= 'AddSportif2'),
    path('sportif/delete/<str:username>', views.DeleteSportif.as_view(), name= 'AddSportif3'),
    path('sportif/edit', views.UpdateSportif.as_view(), name= 'AddSportif4'),

]
