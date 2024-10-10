import logging
from django.shortcuts import render

from django.http import HttpResponse


logger = logging.getLogger(__name__)

def home(request):
    logger.info("hello")
    print("hello")
    return render(request,'about.html')
