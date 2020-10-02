---
title: 'Learn Django By Building a Blog App'
date: '2020-10-01'
---


If you're a regular Flask user like me, you might be curious about other Python web frameworks and how they compare. I've been wanting to try out Django for a while now, so I thought it would be fun to try to build a simple project in Django.


Django is a popular web framework that is very widely used. Companies like Instagram, Mozilla, Bitbucket, Spotify, Youtube, etc. all use Django. So let's see what the hype is all about! By the end of this post, you should have a basic blog app built with Django.

![django logo](https://i0.wp.com/edlibre.com/new/wp-content/uploads/2016/02/djangopony.jpg)

(You don't have to be a Flask user to follow this tutorial, but I will be offering my own thoughts and comparisons throughout.)

## Some Flask vs. Django musings

(Skip this section if you want to just dive right into Django.)

Some preliminary googling sent a few main buzzwords my way, and I would be remiss not to share them with you. Do you really "know" any technology without knowing the main buzzwords? (Would like to emphasize "know" vs. actually know :D)

![flask vs. django](https://hackr.io/blog/flask-vs-django/thumbnail/large)

Flask is LIGHTWEIGHT. Django has BATTERIES INCLUDED.

Ok. What does that mean?

Flask is a micro-framework. A core Flask app is simple. If you want to add on more functionality, like a database abstraction layer or form validation, you have to rely on external plugins and libraries.

Django, on the other hand, gives you a lot of stuff right out of the box. It has its own ORM (object-relational mapper. Flask users may be using something like sqlalchemy), has packages that handle security features (e.g. to validate against CSRF and XSS attacks. Which I thought was very cool!), authentication, etc. And in order to use these fun magical features, Django web apps will tend to follow an official stack structure. So, Django is more "opinionated" than Flask, which leaves everything up for you to decide and add on.

Now that we have a better idea of what Django is like, let's dive in and build our blog!

## Setting things up

### Creating a Django project

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

Let's now map our view to a URL. Inside `blog/`, create a `urls.py` file containing:

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
    path('blog/', include('blog.urls')),
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

We now want to include our blog app to the `INSTALLED_APPS` in `mysite/settings.py`. Add `blog.apps.BlogConfig` to the list. (If you go to `blog/apps.py`, you will see the `BlogConfig` class, our app configuration).

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
from django.utils import timezone

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

Remember that admin app 'django.contrib.admin' we kept in the `INSTALLED_APPS` list of our settings? We're going to use it now!

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
    posts = Post.objects.order_by('-pub_date').all()
    template = loader.get_template('blog/index.html')
    context = {'posts': posts}
    return HttpResponse(template.render(context, request))

def post(request, post_id):
    return HttpResponse(f"Here is post {post_id}.")
```

Now, under our `blog/` directory, add a `templates` directory. Django will know to look for templates here. We will use Django's own templating language. Inside `templates/`, add another `blog/` directory and `index.html`.

In our new `blog/templates/blog/index.html` file, add:

```plaintext
<h1>Our Fun Blog</h1>
{% if posts %}
    <ul>
    {% for post in posts %}
        <li><a href="/blog/{{ post.id }}/">{{ post.title }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No posts are available.</p>
{% endif %}
```

Now, you should see your blog posts at `http://localhost:8000/blog/`. Woohoo!

Note: an alternative Django way of handling the view:

```python
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render

from .models import Post

def index(request):
    posts = Post.objects.order_by('-pub_date').all()
    context = {'posts': posts}
    return render(request, 'blog/index.html', context)

def post(request, post_id):
    return HttpResponse(f"Here is post {post_id}.")
```

Another note: if you have trouble routing to a particular page, check whether your path ends with a slash, and whether that corresponds with what you have set up in your URLconf. Django is very opinionated about slashes as well!

## Summary

By now, we have created a simple Django web app. You can refer to the official [Django docs](https://docs.djangoproject.com/en) for more information on different ways to enhance your blog.

All in all, I thoroughly enjoyed my intro to Django experience and I hope you did too. For a quick setup, I definitely liked Django's auto-generation of app structure, which is much faster than manually setting up directories in Flask. I think Flask is a great way to get started learning all the components of a web framework, and starting there definitely helps you appreciate and understand the magic of Django.

![web framework comic](https://i.pinimg.com/originals/4f/a2/28/4fa2281e151a174ca7c5d716e1c1f3d4.png)

_Disclaimer: This is a light adaptation of the Django 3.1 tutorial found in the official Django docs, which sets up a polls app. But blogs are fun, too! Here we strip away a lot of extraneous information from the tutorial to reduce some mind clutter for any first-time Django users. They're definitely worth looking through now that you've gone through this tutorial, though. Happy coding! :)_
