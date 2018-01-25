import logging
import os
import json
import subprocess
import shutil
import io
import ruamel.yaml as yaml
import requests
import tarfile
import fileinput

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
            {'key': 'host', 'label':'Hostname', 'required': True},
            {'key': 'user', 'label': 'User name', 'required': True},
            {'key': 'password', 'label': 'Password', 'required': True},
            {'key': 'dbname', 'label': 'Database', 'required': True},
            {'key': 'port', 'label': 'Port', 'required': True},
            {'key': 'schema', 'label': 'Schema', 'required': False}
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


api_token = None

@api_view(['GET', 'POST'])
def taps(request):
    if request.method == 'POST':
        if not request.data:
            return Response({'Supply a tap'}, status=status.HTTP_400_BAD_REQUEST)
        specific_tap = next(iter(request.data.values()))
        for k in SUPPORTED_TAPS:
            if specific_tap and specific_tap in k['key']:
                content = dict(install = 'pip install {}'.format(specific_tap))
                with open('Makefile', 'w') as outfile:
                    yaml.dump(content, outfile, default_flow_style=False)
                desired_config = [config[key] for config in TAP_CONFIG for key in config if key == specific_tap]
                data = {'config' : desired_config[0]}
                generate_make_file(specific_tap)
                return Response(data, status=status.HTTP_200_OK)
        content = {'Tap {}'.format(specific_tap): 'Not available'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)

    data = SUPPORTED_TAPS
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def schema_config(request, tap):
    f = open(r'catalog.json','w')
    req_data = request.data
    if req_data:
        with open('config.json', 'w') as outfile:
            json.dump(req_data, outfile)
        # TODO: catch exceptions
        success = subprocess.call('tap-redshift --config config.json -d', shell=True, stdout=f)
        f.close()
        if success == 0:
            with open('catalog.json', 'r') as catalog:
                data = json.loads(catalog.read())
            return Response(data, status=status.HTTP_200_OK)
        return Response({'failed': 'Bad request - Make sure you are supplying the right and all keys.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'failed': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def selected_fields(request):
    selected_fields = request.data
    if selected_fields:
        with open('properties.json', 'w') as outfile:
            json.dump(selected_fields, outfile)
        content = {"Successful": "Selected fields ready for sync"}
        return Response(content, status=status.HTTP_200_OK)
    return Response({'failed': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def target_config(request):
    target_config = request.data
    if target_config:
        target_config['api_token'] = api_token
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
    api_token = response.access_token
    return Response(response)



def generate_make_file(tap):
    # We need to create a makefile that looks like;
    # install:
        # virtualenv --python=/usr/local/bin/python3 env-tap; \
        # source env/bin/activate; \
        # pip install tap;

        # virtualenv --python=/usr/local/bin/python3 env-target; \
        # source env/bin/activate; \
        # pip install target;
    # full-sync:
        # tap-redshift -c config.json --properties properties.json | target-datadotworld -c config_target.json
    # sync:
        # tap-redshift -c config.json --properties properties.json --state state.json | target-datadotworld -c config_target.json
    target = 'target-datadotworld'

    install_cmd = """\
    install: |
        virtualenv --python=/usr/local/bin/python3 env-{}; \\
        source env-{}/bin/activate; \\
        pip install {};
        virtualenv --python=/usr/local/bin/python3 env-{}; \\
        source env-{}/bin/activate; \\
        pip install {};
    full-sync: |
        {} -c config.json --properties properties.json | {} -c target_config.json
    sync: |
        {} -c config.json --properties properties.json --state state.json | {} -c target_config.json
    """.format(tap, tap, tap, target, target, target, tap, target, tap, target)

    with open('Makefile', 'w') as outfile:
        yaml.round_trip_dump(yaml.round_trip_load(install_cmd), outfile, default_flow_style=False, indent=4)


@api_view(['GET'])
def tar_file_generator(request):

    # We need to convert spaces to tabs for the Makefile
    # since only tabs are allowed in Makefile otherwise spaces
    # will cause errors when trying to run make command after
    # the packaged files are unpacked.
    for line in fileinput.FileInput("Makefile", inplace=4):
        print(line.replace("    ","\t"))

    # filenames = path to the files
    filenames = ["catalog.json", "properties.json", "config.json", "target_config.json", "Makefile"]

    # Folder name in tar archive which contains the above files
    tar_subir = "redshift+dw-singer"
    tar_filname = "%s.tar.gz" % tar_subir

    # Open BytesIO to grab in-memory tar contents
    s = io.BytesIO()
    tf = tarfile.open(mode = "w:gz", fileobj = s)

    for fpath in filenames:
        fdir, fname = os.path.split(fpath)
        tar_path = os.path.join(tar_subir, fname)
        tf.add(fpath, tar_path)

    tf.close()

    # Grab tar file from in-memory, make response with correct MIME-type
    resp = HttpResponse(s.getvalue(), content_type = 'application/tgz')
    resp['Content-Disposition'] = 'attachment; filename=%s' % tar_filname
    return resp
