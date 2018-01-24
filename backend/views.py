import logging
import os
import json
import subprocess
import zipfile
import shutil
import io
import yaml
import requests

from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

import tap_redshift


SUPPORTED_TAPS = [
    {
        'name': 'Redshift',
        'key': 'tap-redshift',
        'repo': 'https://github.com/datadotworld/tap-redshift',
        'logo': 'https://cdn.zapier.com/storage/services/1e66b95901e0564c9e990c320705b69a.128x128.png'
    }
]

TAP_CONFIG = [
    {
        'tap-redshift': [
            {'key': 'host', 'label':'Hostname'},
            {'key': 'port', 'label': 'Port'},
            {'key': 'dbname', 'label': 'Database'},
            {'key': 'user', 'label': 'User name'},
            {'key': 'password', 'label': 'Password'},
            {'key': 'schema', 'label': 'Schema'}
        ]
    }
]


class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """

    def get(self, request):
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead, or
                run `yarn run build` to test the production version.
                """,
                status=501,
            )


@api_view(['GET', 'POST'])
def taps(request):
    if request.method == 'POST':
        specific_tap = next(iter(request.data.values()))
        for k in SUPPORTED_TAPS:
            if specific_tap and specific_tap in k['key']:
                content = dict(install = 'pip install {}'.format(specific_tap))
                with open('Makefile', 'w') as outfile:
                    yaml.dump(content, outfile, default_flow_style=False)
                desired_config = [config[key] for config in TAP_CONFIG for key in config if key == specific_tap]
                data = {'config' : desired_config[0]}
                return Response(data)
        content = {'please move along': 'nothing to see here'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)

    data = SUPPORTED_TAPS
    return Response(data)


@api_view(['POST'])
def schema_config(request, tap):
    f = open(r'properties.json','w')
    with open('config.json', 'w') as outfile:
        json.dump(request.data, outfile)
    # TODO: catch exceptions
    success = subprocess.call('tap-redshift --config config.json -d', shell=True, stdout=f)
    f.close()
    with open('properties.json', 'r') as catalog:
        data = catalog.read()
    return Response(data)


@api_view(['POST'])
def selected_fields(request):
    selected_fields = request.data
    if selected_fields:
        with open('catalog.json', 'w') as outfile:
            json.dump(selected_fields, outfile)
        content = {"successful": "selected fields ready for sync"}
        return Response(content, status=status.HTTP_200_OK)
    return Response(content, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def target_config(request):
    target_config = request.data
    if target_config:
        with open('target_config.json', 'w') as outfile:
            json.dump(target_config, outfile)
        content = {"successful": "configuration set successfully"}
        return Response(content, status=status.HTTP_200_OK)
    return Response(content, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def access_token(request):
    data = request.data
    url = 'https://data.world/oauth/access_token'
    dw_code = data.get('code', None)
    client_id = os.environ['KNOT_CLIENT_ID']
    client_secret = os.environ['KNOT_CLIENT_SECRET']
    payload = {
        'code': dw_code,
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': "authorization_code"
    }
    response = requests.post(url, params=payload)
    return Response(response)



@api_view(['POST'])
def zip_file_generator(request):

    # filenames = path to the files
    filenames = ["catalog.json", "config.json", "target_config.json", "Makefile"]

    # Folder name in ZIP archive which contains the above files
    # E.g [thearchive.zip]/somefiles/file2.txt
    zip_subdir = "redshift+dw-singer"
    zip_filename = "%s.zip" % zip_subdir

    # Open BytesIO to grab in-memory ZIP contents
    s = io.BytesIO()
    # The zip compressor
    zf = zipfile.ZipFile(s, "w")

    for fpath in filenames:
        # Calculate path for file in zip
        fdir, fname = os.path.split(fpath)
        zip_path = os.path.join(zip_subdir, fname)

        # Add file, at correct path
        zf.write(fpath, zip_path)

    # Must close zip for all contents to be written
    zf.close()

    # Grab ZIP file from in-memory, make response with correct MIME-type
    resp = HttpResponse(s.getvalue(), content_type = "application/x-zip-compressed")
    # ..and correct content-disposition
    resp['Content-Disposition'] = 'attachment; filename=%s' % zip_filename
    s.tell()
    return resp
