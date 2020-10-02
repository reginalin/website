---
title: 'How to Build a Simple Blog with Django'
date: '2020-10-01'
---

## Setting things up

### Creating a Django project

Inside the directory, run `django-admin startproject mysite`.

Create a directory called `django-blog`. Inside the directory, activate a Python virtual environment and run `pip install django`. You should now have Django installed.

To verify that this is the case, run:

```
python -m django --version
```

This will return a version number if you have successfully installed Django. I'm using Django 3.1, the latest at the time of writing. This tutorial assumes that you are using Django 3.1.

Now, inside your `django-blog` directory, run:

```
django-admin startproject mysite
```

Now, you will have a new project directory called `mysite`. If you go inside, you'll see that `startproject` populated your `mysite` project with auto-generated files. Amazing! Magical!

The structure should look like this:

```
mysite/
    manage.py
    mysite/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
```

We break down the main files below:

- The outer `mysite/` is the root directory for your project. You can feel free to rename it to anything apart from reserved keywords like `Django` and `Test`.
- `manage.py` is a command-line utility that lets you interact with the Django project.
- The inner `mysite/` is the Python package for the project. (You can tell it's a package because of the `__init__.py` inside)
- `mysite/settings.py` contains the settings/configuration for the project.
- `mysite/urls.py` is a Django-described "table of contents." URLs are declared here.
- `mysite/asgi.py` and `mysite.wsgi.py` are entrypoints for ASGI and WSGI compatible web servers. We won't worry about these two files in this tutorial, but if you want to use these web server standards to deploy your app in production, you can read more about them in the Django docs.

### Running the app

Now let's run it! Enter the following in your terminal:

```
python manage.py runserver
```

You should see a message prompting you to open `http://127.0.0.1:8000/` in your web browser. Hooray! We've started up our development server!

## Creating our Blog app

Now that we have our project set up, let's create our blog app. (An app is a web application that does something, like our blog. It might be easy to confuse this with the concept of a Django project, which can contain many apps and the configurations that go into building a full website)

Inside your top-level `mysite/` directory, run:

```
python manage.py startapp blog
```

Django's `startapp` utility automagically generates the following app structure for you:

```
blog/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

Now we have a blog app set up!

### Views

As with any fun project you build, we need to start off with a "Hello World." Let's create our first "Hello World" view.

Inside `blog/views.py`, write:

```Python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello world! Welcome to my super fun blog.")

```

Let's now map our view to a URL. Inside `polls/`, create a `urls.py` file containing:

```python
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

We have configured a root URL for our blog. We now want to connect this to a URL configuration (a URLconf in Django-speak) in `mysite` as well. Modify `mysite/urls.py` to the following:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('admin/', admin.site.urls),
]
```

The `include()` lets us route the rest of the path to the included URLconf.

Now, start up the server again:

```
python manage.py runserver
```

Open `http://localhost:8000/blog/` to see your first view. It should say "Hello world! Welcome to my super fun blog." How fun indeed.

## Now the database stuff

### Database setup

By default, our site has been configured to use SQLite. You can go into `mysite/settings.py` to see the details specified by the `DATABASE` variable.

For this tutorial, we will stick to SQLite, although you are welcome to change things up.

Let's take a closer look into`settings.py`.

`INSTALLED_APPS` lists all the Django apps that have already been set up for us. This includes an admin site, an authentication system, a messaging framework, etc. We can see that the Django scaffolding has a lot baked into it, for convenience and speed of development. We will only use `django.contrib.admin`, so feel free to delete the rest of the apps.

To set up the database tables used by the pre-installed Django apps including the admin site, let's run:

```
python manage.py migrate
```

This runs all the database migrations.

### Writing our Models

Inside `blog/models.py`, we will define our database models:

```python
from django.db import models

class Blogger(models.Model):
    name = models.CharField(max_length=100)

class Post(models.Model):
    title = models.CharField(max_length=200)
    text = models.CharField(max_length=1000)
    pub_date = models.DateTimeField('date published')
    blogger = models.ForeignKey(Blogger, models.SET_NULL, blank=True, null=True)
```

Here, we've defined two models, a `Blogger` and a `Post`. We can see that each Post contains a foreign key pointing to its associated Blogger.

### Create new migrations

We now want to include our blog app to the `INSTALLED_APPS` in `mysite/settings.py`. Add `blog.app.BlogConfig` to the list. (If you go to `blog/apps.py`, you will see the `BlogConfig` class, our app configuration).

Now, generate the migrations for our blog:

```
python manage.py makemigrations blog
```

The new migration should now be in `blog/migrations/0001_initial.py`. Run the following to see what SQL will be run by the migration:

```
python manage.py sqlmigrate blog 0001
```

Now run the migration:

```
python manage.py migrate
```

Your tables should now have been created!

### Create data

To create data, we will interact directly with the database using Django's database API. First, we activate the Python shell:

```
python manage.py shell
```

Inside the shell, import our models:

```python
from blog.models import Blogger, Post
```

Check the existing Posts:

```python
Post.objects.all()
```

There should be none. Now, we will create a new Post:

```python
post = Post(title="Post 1", text="Posting some fun stuff!", pub_date=timezone.now())

post.save()
```

Try running:

```python
post.id

post.pub_date

Post.objects.all()

Post.objects.filter(id=1)

Post.objects.filter(pk=1)

Post.objects.filter(text__startswith='Post')
```

## Django Admin

Remember that admin app 'django.contrib.admin' we kept in  the `INSTALLED_APPS` list of our settings? We're going to use it now!

Let's create a user login. Run the following and complete the prompts:

```
python manage.py createsuperuser
```

Now, go to `http://localhost:8000/admin` and log in. We're in the admin UI! Here, you can configure different aspects of our site.

### Set up our blog app in Django Admin

To modify our blog app within Django Admin, modify the `blog/admin.py` file:

```python
from django.contrib import admin

from .models import Post, Blogger

admin.site.register(Post)
admin.site.register(Blogger)
```

Now, you can create Posts and Bloggers as an admin! One thing I noticed at this point was that my Posts and Blogger items didn't show up with very descriptive names. So I added `__str__` functions to both models inside `models.py`:

```python
from django.db import models

class Blogger(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=200)
    text = models.CharField(max_length=1000)
    pub_date = models.DateTimeField('date published')
    blogger = models.ForeignKey(Blogger, models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.title
```

## Creating our blog page

Now to actually see our blog posts, we want to create a view. In `blog/views.py`, write:

```python
def post(request, post_id):
    return HttpResponse("Here is post %s." % post_id)
```

Now let's set up our URLconf to map to the view. In `blog/urls.py`:

```python
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:post_id>/', views.post, name='post'),
]
```

Now, let's display our posts at our blog index. Add this to `blog/views.py`:

```python
from django.http import HttpResponse
from django.template import loader

from .models import Post

def index(request):
    latest_post_list = Post.objects.order_by('-pub_date').all()
    template = loader.get_template('blog/index.html')
    context = {
        'latest_post_list': latest_post_list,
    }
    return HttpResponse(template.render(context, request))


def post(request, post_id):
    return HttpResponse('Here is post %s.' % post_id)
```

Now, under our `blog/` directory, add a `templates` directory. Django will know to look for templates here. Inside, add another `blog/` directory and `index.html`.

In our new `blog/templates/blog/index.html` file, add:

```
<h1>Our Fun Blog</h1>
{% if latest_post_list %}
    <ul>
    {% for post in latest_post_list %}
        <li><a href="/blog/{{ post.id }}/">{{ post.title }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No posts are available.</p>
{% endif %}
```

Now, you should see your blog posts at `http://localhost:8000/blog/`. Woohoo!

## Summary

By now, we have created a simple Django web app. You can refer to the official [Django docs](https://docs.djangoproject.com/en/3.1/) for more information.
