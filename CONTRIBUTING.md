## Running locally

### Clone the repository

```bash
git clone https://github.com/datadotworld/knot.git
cd knot
```

### Set up Python

Install Python 3

```bash
brew install python3
```

Install `pip`

```bash
sudo easy_install pip
```

Install `virtualenv`

```bash
sudo pip install virtualenv
```

Create a virtual environment for the app to run in

```bash
virtualenv --python=/usr/local/bin/python3 env
source env/bin/activate
```

Install app requirements

```
pip install -r requirements.txt
```

### Run the app

From the root directory:

```bash
export KNOT_CLIENT_ID=knot-local&&export KNOT_CLIENT_SECRET=iEcKy7joLVrJgtbm6YzzhTuxwsxU.jVb&&python3 manage.py runserver
```

Access the app at `http://127.0.0.1:8000/`

### Run in development mode

Install frontend dependencies

```bash
cd frontend
yarn
```

Run the app in watch mode

```bash
export KNOT_CLIENT_ID=knot-local&&export KNOT_CLIENT_SECRET=iEcKy7joLVrJgtbm6YzzhTuxwsxU.jVb&&python3 manage.py runserver
```

On a different terminal

```bash
echo "REACT_APP_OAUTH_AUTH_URL=https://data.world/oauth/authorize?client_id=knot-local&redirect_uri=http://localhost:3000/callback&response_type=code" >> .env
yarn start
```

Access the app at `http://localhost:3000/`
